import {
  ROLES,
  type CandidateEvaluation,
  type ChartCandidate,
  type ChartFacts,
  type DimensionStates,
  type EvidenceState,
  type EvidenceStates,
  type FinalState,
  type ManifestationAnswer,
  type MechanismEvaluation,
  type MechanismId,
  type NearestNeighborResult,
  type NodeAvailability,
  type NodeAvailabilityByRole,
  type NormalizedRelation,
  type Occurrence,
  type RelationClosure,
  type RelationDirection,
  type RelationEffectiveness,
  type RelationKind,
  type Role,
  type SeasonalStrength,
  type StaticRuleEngineInput,
  type StaticRuleEngineResult,
  type TensionState,
} from "./types";

const MECHANISMS = ["A01", "A02", "A03", "A04"] as const;
const EVIDENCE_KEYS = ["E1", "E2", "E3", "E4", "E5", "E6"] as const;
const DIMENSION_KEYS = ["D1", "D2", "D3", "D4", "D5", "D6"] as const;
const SEASONAL_SCORES: Record<Exclude<SeasonalStrength, "unknown">, number> = {
  旺: 2,
  相: 1,
  休: 0,
  囚: -1,
  死: -2,
};

type RoleCategory = "self" | "input" | "output" | "resource" | "constraint";
type PathState = RelationEffectiveness;
interface RelationWithoutEffectiveness {
  readonly kind: RelationKind;
  readonly sourceObjectKey: string;
  readonly targetObjectKey: string;
  readonly sourceRole: Role;
  readonly targetRole: Role;
  readonly direction: RelationDirection;
  readonly canonicalRelationKey: string;
  readonly originClusterKeys: readonly string[];
  readonly sourceDedupeKey: string;
}

interface CoreAggregate {
  readonly timeBasisVersion: "civil_time_v1";
  readonly candidateResults: readonly CandidateEvaluation[];
  readonly nodeAvailability: NodeAvailabilityByRole;
  readonly evidence: EvidenceStates;
  readonly dimensions: DimensionStates;
  readonly coreCandidates: readonly MechanismId[];
  readonly coreMechanism: MechanismId | null;
  readonly finalState: FinalState;
}

export function evaluateContentRebuild(
  input: StaticRuleEngineInput,
): StaticRuleEngineResult {
  validateEngineInput(input);

  // Core evaluation intentionally receives no manifestation answers.
  const core = evaluateCore(input.timeBasisVersion, input.candidates);
  const manifestationVariant = deriveManifestationVariant(
    input.manifestationAnswers ?? [],
  );

  return deepFreeze({
    ...core,
    manifestationVariant,
  });
}

export function evaluateSingleCandidate(
  candidate: ChartCandidate,
): CandidateEvaluation {
  validateCandidate(candidate, "candidate");
  return deepFreeze(evaluateCandidate(candidate));
}

function evaluateCore(
  timeBasisVersion: "civil_time_v1",
  candidates: readonly ChartCandidate[],
): CoreAggregate {
  const candidateResults = [...candidates]
    .sort((left, right) => left.candidateId.localeCompare(right.candidateId))
    .map(evaluateCandidate);
  const stableCore = candidateResults.every((result) =>
    sameCoreResult(result, candidateResults[0]),
  );

  const nodeAvailability = aggregateNodeAvailability(candidateResults);
  const dimensions = aggregateDimensions(candidateResults);
  const evidence = aggregateEvidence(candidateResults, stableCore);

  if (stableCore) {
    const first = candidateResults[0];
    return {
      timeBasisVersion,
      candidateResults,
      nodeAvailability,
      evidence,
      dimensions,
      coreCandidates: first.coreCandidates,
      coreMechanism: first.coreMechanism,
      finalState: first.finalState,
    };
  }

  return {
    timeBasisVersion,
    candidateResults,
    nodeAvailability,
    evidence,
    dimensions,
    coreCandidates: sortedUnique(
      candidateResults.flatMap((result) => result.coreCandidates),
    ) as MechanismId[],
    coreMechanism: null,
    finalState: "boundary_sensitive",
  };
}

function evaluateCandidate(candidate: ChartCandidate): CandidateEvaluation {
  const nodeAvailability = calculateNodeAvailability(candidate.facts);
  const closure = buildRelationClosure(candidate.facts, nodeAvailability);
  const dimensions = calculateDimensions(
    candidate.facts,
    nodeAvailability,
    closure.relations,
  );
  const originClusterKeys = sortedUnique(
    candidate.facts.occurrences.map((occurrence) => occurrence.originClusterKey),
  );
  const tensions = calculateTensions(dimensions);
  const tension = aggregateTension(tensions);
  const mechanismEvaluations = evaluateMechanisms(
    dimensions,
    tensions,
    originClusterKeys.length,
  );
  const exclusion = MECHANISMS.some(
    (mechanism) => mechanismEvaluations[mechanism].excluded,
  );
  const nearestNeighbor = evaluateNearestNeighbors(mechanismEvaluations);
  const establishedMechanisms = nearestNeighbor.passingMechanisms;
  const candidateMechanisms = MECHANISMS.filter(
    (mechanism) => mechanismEvaluations[mechanism].state === "candidate",
  );
  const excludedMechanisms = MECHANISMS.filter(
    (mechanism) => mechanismEvaluations[mechanism].excluded,
  );

  let coreCandidates: readonly MechanismId[] = [];
  let coreMechanism: MechanismId | null = null;
  let finalState: FinalState;

  if (establishedMechanisms.length === 1) {
    coreCandidates = establishedMechanisms;
    coreMechanism = establishedMechanisms[0];
    finalState = "established";
  } else if (establishedMechanisms.length > 1) {
    coreCandidates = establishedMechanisms;
    finalState = "candidate";
  } else if (excludedMechanisms.length > 0) {
    finalState = "conflicted";
  } else if (candidateMechanisms.length > 0) {
    coreCandidates = candidateMechanisms;
    finalState = "candidate";
  } else {
    finalState = "not_supported";
  }

  const evidence = calculateEvidence(
    nodeAvailability,
    closure,
    tension,
    finalState,
  );
  const evidenceFamilies = [
    "node_availability",
    "complete_relation_closure",
    "same_origin_tension",
    ...(exclusion ? ["exclusion_boundary"] : []),
  ];

  return {
    candidateId: candidate.candidateId,
    nodeAvailability,
    closure,
    evidence,
    dimensions,
    evidenceFamilies,
    originClusterKeys,
    tensions,
    tension,
    mechanismEvaluations,
    exclusion,
    nearestNeighbor,
    coreCandidates,
    coreMechanism,
    finalState,
  };
}

function calculateNodeAvailability(facts: ChartFacts): NodeAvailabilityByRole {
  return Object.fromEntries(
    ROLES.map((role) => [role, calculateRoleAvailability(facts, role)]),
  ) as unknown as NodeAvailabilityByRole;
}

function calculateRoleAvailability(
  facts: ChartFacts,
  role: Role,
): NodeAvailability {
  const occurrences = facts.occurrences.filter(
    (occurrence) => occurrence.role === role,
  );
  const seasonalStrength = facts.seasonalStrength[role];
  const visibleScore = occurrences.some(
    (occurrence) =>
      occurrence.kind === "day_anchor" || occurrence.kind === "visible",
  )
    ? 1
    : 0;
  const rootContributionByCluster = new Map<string, number>();

  for (const occurrence of occurrences) {
    const contribution = rootContribution(occurrence);
    rootContributionByCluster.set(
      occurrence.originClusterKey,
      Math.max(
        rootContributionByCluster.get(occurrence.originClusterKey) ?? 0,
        contribution,
      ),
    );
  }

  const rootScore = Math.min(
    2,
    [...rootContributionByCluster.values()].reduce(
      (sum, contribution) => sum + contribution,
      0,
    ),
  );

  if (seasonalStrength === "unknown") return "unknown";

  const score = SEASONAL_SCORES[seasonalStrength] + rootScore + visibleScore;
  if (occurrences.length > 0 && score >= 2) return "usable";
  if (facts.missingPositions.length > 0) return "unknown";
  if (occurrences.length > 0) return "limited";
  return "absent";
}

function rootContribution(occurrence: Occurrence): number {
  if (!occurrence.rootOccurrence) return 0;
  const proportion = occurrence.hiddenStemProportion;
  if (proportion === null) return 0;
  if (proportion >= 0.5) return 2;
  if (proportion >= 0.2) return 1;
  return 0;
}

function buildRelationClosure(
  facts: ChartFacts,
  nodeAvailability: NodeAvailabilityByRole,
): RelationClosure {
  const occurrences = [...facts.occurrences].sort((left, right) =>
    left.objectKey.localeCompare(right.objectKey),
  );
  const expectedRelationCount =
    (occurrences.length * (occurrences.length - 1)) / 2;
  const rawRelations: RelationWithoutEffectiveness[] = [];

  for (let leftIndex = 0; leftIndex < occurrences.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < occurrences.length;
      rightIndex += 1
    ) {
      rawRelations.push(
        deriveRelation(occurrences[leftIndex], occurrences[rightIndex]),
      );
    }
  }

  const canonicalKeys = new Set(
    rawRelations.map((relation) => relation.canonicalRelationKey),
  );
  if (canonicalKeys.size !== rawRelations.length) {
    throw new Error("Relation closure generated a duplicate canonical relation key");
  }

  const sourceRepresentativeMap = new Map<
    string,
    RelationWithoutEffectiveness
  >();
  for (const relation of rawRelations) {
    if (!sourceRepresentativeMap.has(relation.sourceDedupeKey)) {
      sourceRepresentativeMap.set(relation.sourceDedupeKey, relation);
    }
  }
  const sourceRepresentatives = [...sourceRepresentativeMap.values()];

  const baseEffectiveness = new Map<string, RelationEffectiveness>();
  for (const relation of sourceRepresentatives) {
    baseEffectiveness.set(
      relation.sourceDedupeKey,
      calculateBaseEffectiveness(relation, nodeAvailability),
    );
  }

  const competitionGroups = new Map<string, Set<string>>();
  for (const relation of sourceRepresentatives) {
    addCompetitionGroup(
      competitionGroups,
      `${relation.kind}:${relation.direction}:${relation.sourceObjectKey}:${relation.targetRole}`,
      relation.sourceDedupeKey,
    );
    addCompetitionGroup(
      competitionGroups,
      `${relation.kind}:${relation.direction}:${relation.targetObjectKey}:${relation.sourceRole}`,
      relation.sourceDedupeKey,
    );
  }
  const competitionSourceKeys = new Set<string>();
  for (const sourceKeys of competitionGroups.values()) {
    if (sourceKeys.size < 2) continue;
    for (const sourceKey of sourceKeys) competitionSourceKeys.add(sourceKey);
  }

  const relations = rawRelations.map((relation): NormalizedRelation => {
    const base = baseEffectiveness.get(relation.sourceDedupeKey);
    if (!base) throw new Error("Missing relation effectiveness");
    const limitedByCompetition =
      base === "effective" &&
      competitionSourceKeys.has(relation.sourceDedupeKey);
    return {
      ...relation,
      effectiveness: limitedByCompetition ? "limited" : base,
      limitedByCompetition,
    };
  });

  const sourceDedupedRelations = sourceRepresentatives
    .map((representative) => {
      const relation = relations.find(
        (item) => item.sourceDedupeKey === representative.sourceDedupeKey,
      );
      if (!relation) throw new Error("Missing source-deduped relation");
      return relation;
    })
    .sort((left, right) =>
      left.canonicalRelationKey.localeCompare(right.canonicalRelationKey),
    );

  const relationEffectivenessCounts: Record<RelationEffectiveness, number> = {
    effective: 0,
    limited: 0,
    blocked: 0,
    unknown: 0,
  };
  for (const relation of relations) {
    relationEffectivenessCounts[relation.effectiveness] += 1;
  }

  return {
    expectedRelationCount,
    rawRelationCount: relations.length,
    relations,
    sourceDedupedRelations,
    relationEffectivenessCounts,
    diagnostics: {
      invalidRoleRelationCount: 0,
      missingDeterministicRelationCount:
        expectedRelationCount - relations.length,
      duplicateRelationAfterSourceDedupeCount: 0,
      unexpectedManuallySelectedRelationCount: 0,
    },
  };
}

function deriveRelation(
  left: Occurrence,
  right: Occurrence,
): RelationWithoutEffectiveness {
  const leftCategory = roleCategory(left.role);
  const rightCategory = roleCategory(right.role);

  if (leftCategory === rightCategory) {
    return createRelation("same_role", left, right);
  }

  const generates: readonly (readonly [RoleCategory, RoleCategory])[] = [
    ["input", "self"],
    ["self", "output"],
    ["output", "resource"],
    ["resource", "constraint"],
    ["constraint", "input"],
  ];
  const controls: readonly (readonly [RoleCategory, RoleCategory])[] = [
    ["self", "resource"],
    ["resource", "input"],
    ["input", "output"],
    ["output", "constraint"],
    ["constraint", "self"],
  ];

  for (const [source, target] of generates) {
    if (leftCategory === source && rightCategory === target) {
      return createRelation("generates", left, right);
    }
    if (rightCategory === source && leftCategory === target) {
      return createRelation("generates", right, left);
    }
  }
  for (const [source, target] of controls) {
    if (leftCategory === source && rightCategory === target) {
      return createRelation("controls", left, right);
    }
    if (rightCategory === source && leftCategory === target) {
      return createRelation("controls", right, left);
    }
  }

  throw new Error(
    `Unsupported role relation pair: ${left.role}/${right.role}`,
  );
}

function createRelation(
  kind: RelationKind,
  sourceInput: Occurrence,
  targetInput: Occurrence,
): RelationWithoutEffectiveness {
  let source = sourceInput;
  let target = targetInput;
  if (
    kind === "same_role" &&
    source.objectKey.localeCompare(target.objectKey) > 0
  ) {
    source = targetInput;
    target = sourceInput;
  }

  const direction: RelationDirection =
    kind === "same_role" ? "undirected" : "forward";
  const originClusterKeys = sortedUnique([
    source.originClusterKey,
    target.originClusterKey,
  ]);
  const canonicalRelationKey = `${kind}:${source.objectKey}>${target.objectKey}`;
  const sourceDedupeParts = [
    kind,
    source.role,
    target.role,
    source.originClusterKey,
    target.originClusterKey,
  ];

  return {
    kind,
    sourceObjectKey: source.objectKey,
    targetObjectKey: target.objectKey,
    sourceRole: source.role,
    targetRole: target.role,
    direction,
    canonicalRelationKey,
    originClusterKeys,
    sourceDedupeKey: sourceDedupeParts.join(":"),
  };
}

function roleCategory(role: Role): RoleCategory {
  return role === "subject" || role === "peer" ? "self" : role;
}

function calculateBaseEffectiveness(
  relation: RelationWithoutEffectiveness,
  nodeAvailability: NodeAvailabilityByRole,
): RelationEffectiveness {
  const source = nodeAvailability[relation.sourceRole];
  const target = nodeAvailability[relation.targetRole];
  if (source === "unknown" || target === "unknown") return "unknown";
  if (source === "absent" || target === "absent") return "blocked";
  if (source === "usable" && target === "usable") return "effective";
  return "limited";
}

function addCompetitionGroup(
  groups: Map<string, Set<string>>,
  groupKey: string,
  relationKey: string,
): void {
  const group = groups.get(groupKey) ?? new Set<string>();
  group.add(relationKey);
  groups.set(groupKey, group);
}

function calculateDimensions(
  facts: ChartFacts,
  availability: NodeAvailabilityByRole,
  relations: readonly NormalizedRelation[],
): DimensionStates {
  const inputSubject = relationState(
    relations,
    "generates",
    "input",
    "subject",
  );
  const subjectOutput = relationState(
    relations,
    "generates",
    "subject",
    "output",
  );
  const outputResource = relationState(
    relations,
    "generates",
    "output",
    "resource",
  );
  const outputConstraint = relationState(
    relations,
    "controls",
    "output",
    "constraint",
  );
  const constraintSubject = relationState(
    relations,
    "controls",
    "constraint",
    "subject",
  );
  const constraintInput = relationState(
    relations,
    "generates",
    "constraint",
    "input",
  );

  const D1 = supplyDimension(availability, inputSubject);
  const D2 = outputCapacityDimension(
    facts,
    availability,
    subjectOutput,
  );
  const outputMediated = pathState(
    ["subject", "output", "constraint"],
    [subjectOutput, outputConstraint],
    availability,
  );
  const inputMediated = pathState(
    ["constraint", "input", "subject"],
    [constraintInput, inputSubject],
    availability,
  );
  const direct = pathState(
    ["constraint", "subject"],
    [constraintSubject],
    availability,
  );
  const D3 = constraintMediationDimension(
    availability,
    outputMediated,
    inputMediated,
    direct,
  );
  const D4 = conversionDimension(
    availability,
    inputSubject,
    subjectOutput,
    outputResource,
  );
  const D5 = feedbackDimension(
    availability,
    subjectOutput,
    outputConstraint,
    constraintSubject,
    relations,
  );
  const D6 = resourceInterfaceDimension(availability, outputResource);

  return { D1, D2, D3, D4, D5, D6 };
}

function supplyDimension(
  availability: NodeAvailabilityByRole,
  edge: RelationEffectiveness,
): DimensionStates["D1"] {
  if (availability.input === "unknown" || availability.subject === "unknown") {
    return "unresolved";
  }
  if (
    availability.input === "absent" ||
    availability.subject === "absent" ||
    edge === "blocked"
  ) {
    return "supply_blocked";
  }
  if (
    availability.input === "usable" &&
    availability.subject === "usable" &&
    edge === "effective"
  ) {
    return "supply_continuous";
  }
  if (edge === "unknown") return "unresolved";
  return "supply_limited";
}

function outputCapacityDimension(
  facts: ChartFacts,
  availability: NodeAvailabilityByRole,
  edge: RelationEffectiveness,
): DimensionStates["D2"] {
  const outputVisible = facts.occurrences.some(
    (occurrence) =>
      occurrence.role === "output" && occurrence.kind === "visible",
  );
  if (
    availability.output === "unknown" ||
    availability.subject === "unknown" ||
    edge === "unknown"
  ) {
    return "unresolved";
  }
  if (
    outputVisible &&
    availability.output === "usable" &&
    availability.subject === "limited" &&
    edge === "limited"
  ) {
    return "output_visible_asymmetric";
  }
  if (
    availability.subject === "usable" &&
    availability.output === "usable" &&
    edge === "effective"
  ) {
    return "output_supported";
  }
  if (
    outputVisible &&
    (availability.output === "limited" || edge === "limited")
  ) {
    return "output_limited";
  }
  return "unresolved";
}

function constraintMediationDimension(
  availability: NodeAvailabilityByRole,
  outputMediated: PathState,
  inputMediated: PathState,
  direct: PathState,
): DimensionStates["D3"] {
  if (availability.constraint === "absent") return "blocked";
  if (
    availability.constraint === "unknown" ||
    outputMediated === "unknown" ||
    inputMediated === "unknown" ||
    direct === "unknown"
  ) {
    return "unresolved";
  }
  if (outputMediated === "effective" && inputMediated === "effective") {
    return "mixed";
  }
  if (outputMediated === "effective") {
    return "constraint_mediated_by_output";
  }
  if (inputMediated === "effective") {
    return "constraint_mediated_by_input";
  }
  if (
    outputMediated === "blocked" &&
    inputMediated === "blocked" &&
    direct === "effective"
  ) {
    return "direct_only";
  }
  if (outputMediated === "limited" || inputMediated === "limited") {
    return "unresolved";
  }
  return "blocked";
}

function conversionDimension(
  availability: NodeAvailabilityByRole,
  inputSubject: RelationEffectiveness,
  subjectOutput: RelationEffectiveness,
  outputResource: RelationEffectiveness,
): DimensionStates["D4"] {
  const roles: readonly Role[] = ["input", "subject", "output", "resource"];
  const edges = [inputSubject, subjectOutput, outputResource];
  if (
    roles.some((role) => availability[role] === "unknown") ||
    edges.includes("unknown")
  ) {
    return "unresolved";
  }
  if (
    roles.some((role) => availability[role] === "absent") ||
    edges.includes("blocked")
  ) {
    return "conversion_blocked";
  }
  if (
    roles.every((role) => availability[role] === "usable") &&
    edges.every((edge) => edge === "effective")
  ) {
    return "conversion_continuous";
  }
  return "conversion_limited";
}

function feedbackDimension(
  availability: NodeAvailabilityByRole,
  subjectOutput: RelationEffectiveness,
  outputConstraint: RelationEffectiveness,
  constraintSubject: RelationEffectiveness,
  relations: readonly NormalizedRelation[],
): DimensionStates["D5"] {
  if (
    availability.output === "absent" ||
    availability.constraint === "absent" ||
    outputConstraint === "blocked"
  ) {
    return "uncoupled";
  }
  if (
    availability.output === "unknown" ||
    availability.constraint === "unknown" ||
    [subjectOutput, outputConstraint, constraintSubject].includes("unknown")
  ) {
    return "unresolved";
  }
  if (
    hasCompetition(relations, "controls", "output", "constraint") ||
    hasCompetition(relations, "controls", "constraint", "subject")
  ) {
    return "shared_endpoint_competition";
  }
  if (
    subjectOutput === "limited" &&
    outputConstraint === "effective" &&
    constraintSubject === "limited"
  ) {
    return "output_constraint_regulating";
  }
  if (
    subjectOutput === "effective" &&
    outputConstraint === "effective" &&
    constraintSubject === "effective"
  ) {
    return "output_constraint_feedback";
  }
  return "unresolved";
}

function resourceInterfaceDimension(
  availability: NodeAvailabilityByRole,
  outputResource: RelationEffectiveness,
): DimensionStates["D6"] {
  if (
    availability.output === "unknown" ||
    availability.resource === "unknown" ||
    outputResource === "unknown"
  ) {
    return "unresolved";
  }
  if (
    availability.resource === "absent" ||
    availability.output === "absent" ||
    outputResource === "blocked"
  ) {
    return "resource_interface_blocked";
  }
  if (
    availability.output === "usable" &&
    availability.resource === "usable" &&
    outputResource === "effective"
  ) {
    return "resource_interface_effective";
  }
  return "resource_interface_limited";
}

function relationState(
  relations: readonly NormalizedRelation[],
  kind: RelationKind,
  sourceRole: Role,
  targetRole: Role,
): RelationEffectiveness {
  const matches = relations.filter(
    (relation) =>
      relation.kind === kind &&
      relation.sourceRole === sourceRole &&
      relation.targetRole === targetRole,
  );
  if (matches.length === 0) return "blocked";
  if (matches.some((relation) => relation.effectiveness === "unknown")) {
    return "unknown";
  }
  if (matches.some((relation) => relation.effectiveness === "blocked")) {
    return "blocked";
  }
  if (matches.every((relation) => relation.effectiveness === "effective")) {
    return "effective";
  }
  return "limited";
}

function pathState(
  roles: readonly Role[],
  edges: readonly RelationEffectiveness[],
  availability: NodeAvailabilityByRole,
): PathState {
  if (
    roles.some((role) => availability[role] === "absent") ||
    edges.includes("blocked")
  ) {
    return "blocked";
  }
  if (
    roles.some((role) => availability[role] === "unknown") ||
    edges.includes("unknown")
  ) {
    return "unknown";
  }
  if (
    roles.every((role) => availability[role] === "usable") &&
    edges.every((edge) => edge === "effective")
  ) {
    return "effective";
  }
  return "limited";
}

function hasCompetition(
  relations: readonly NormalizedRelation[],
  kind: RelationKind,
  sourceRole: Role,
  targetRole: Role,
): boolean {
  return relations.some(
    (relation) =>
      relation.kind === kind &&
      relation.sourceRole === sourceRole &&
      relation.targetRole === targetRole &&
      relation.limitedByCompetition,
  );
}

function calculateTensions(
  dimensions: DimensionStates,
): Readonly<Record<MechanismId, TensionState>> {
  const A01: TensionState =
    dimensions.D1 === "supply_continuous" &&
    [
      "resource_interface_limited",
      "resource_interface_blocked",
    ].includes(dimensions.D6)
      ? "established"
      : dimensions.D1 === "supply_limited" &&
          [
            "resource_interface_limited",
            "resource_interface_blocked",
          ].includes(dimensions.D6)
        ? "candidate"
        : "not_supported";
  const A02: TensionState =
    dimensions.D2 === "output_visible_asymmetric" &&
    dimensions.D5 === "output_constraint_regulating"
      ? "established"
      : dimensions.D5 === "shared_endpoint_competition"
        ? "conflicted"
        : dimensions.D2 === "output_limited" &&
            dimensions.D5 === "unresolved"
          ? "candidate"
          : "not_supported";
  const A03: TensionState =
    dimensions.D2 === "output_supported" &&
    dimensions.D5 === "output_constraint_feedback"
      ? "established"
      : dimensions.D5 === "shared_endpoint_competition"
        ? "conflicted"
        : ["output_supported", "output_limited"].includes(dimensions.D2) &&
            dimensions.D5 === "unresolved"
          ? "candidate"
          : "not_supported";
  const A04: TensionState =
    dimensions.D4 === "conversion_continuous" &&
    dimensions.D6 === "resource_interface_effective"
      ? "established"
      : dimensions.D4 === "conversion_limited" &&
          dimensions.D6 === "resource_interface_limited"
        ? "candidate"
        : "not_supported";

  return { A01, A02, A03, A04 };
}

function aggregateTension(
  tensions: Readonly<Record<MechanismId, TensionState>>,
): TensionState {
  const values = Object.values(tensions);
  if (values.includes("conflicted")) return "conflicted";
  if (values.includes("established")) return "established";
  if (values.includes("candidate")) return "candidate";
  return "not_supported";
}

function evaluateMechanisms(
  dimensions: DimensionStates,
  tensions: Readonly<Record<MechanismId, TensionState>>,
  distinctOriginCount: number,
): Readonly<Record<MechanismId, MechanismEvaluation>> {
  const originGate = distinctOriginCount >= 2;
  const excluded = {
    A01:
      dimensions.D1 === "supply_continuous" &&
      [
        "resource_interface_limited",
        "resource_interface_blocked",
      ].includes(dimensions.D6) &&
      [
        "constraint_mediated_by_output",
        "constraint_mediated_by_input",
        "mixed",
      ].includes(dimensions.D3),
    A02:
      dimensions.D2 === "output_visible_asymmetric" &&
      ([
        "shared_endpoint_competition",
        "output_constraint_feedback",
      ].includes(dimensions.D5) || dimensions.D4 === "conversion_continuous"),
    A03:
      dimensions.D2 === "output_supported" &&
      dimensions.D5 === "output_constraint_feedback" &&
      dimensions.D3 !== "constraint_mediated_by_output",
    A04:
      dimensions.D4 === "conversion_continuous" &&
      dimensions.D6 === "resource_interface_effective" &&
      ["constraint_mediated_by_output", "mixed"].includes(dimensions.D3),
  } satisfies Record<MechanismId, boolean>;

  const established = {
    A01:
      dimensions.D1 === "supply_continuous" &&
      [
        "resource_interface_limited",
        "resource_interface_blocked",
      ].includes(dimensions.D6) &&
      tensions.A01 === "established",
    A02:
      dimensions.D2 === "output_visible_asymmetric" &&
      dimensions.D5 === "output_constraint_regulating" &&
      tensions.A02 === "established",
    A03:
      dimensions.D3 === "constraint_mediated_by_output" &&
      dimensions.D2 === "output_supported" &&
      dimensions.D5 === "output_constraint_feedback" &&
      tensions.A03 === "established",
    A04:
      dimensions.D4 === "conversion_continuous" &&
      dimensions.D6 === "resource_interface_effective" &&
      tensions.A04 === "established",
  } satisfies Record<MechanismId, boolean>;

  const candidate = {
    A01: tensions.A01 === "candidate",
    A02: tensions.A02 === "candidate",
    A03: tensions.A03 === "candidate",
    A04: tensions.A04 === "candidate",
  } satisfies Record<MechanismId, boolean>;

  return Object.fromEntries(
    MECHANISMS.map((mechanism) => [
      mechanism,
      {
        state:
          originGate && established[mechanism] && !excluded[mechanism]
            ? "established"
            : originGate && candidate[mechanism] && !excluded[mechanism]
              ? "candidate"
              : "not_supported",
        excluded: excluded[mechanism],
      },
    ]),
  ) as unknown as Readonly<Record<MechanismId, MechanismEvaluation>>;
}

function evaluateNearestNeighbors(
  evaluations: Readonly<Record<MechanismId, MechanismEvaluation>>,
): NearestNeighborResult {
  const passingMechanisms = MECHANISMS.filter(
    (mechanism) => evaluations[mechanism].state === "established",
  );
  const comparisons = MECHANISMS.flatMap((left, leftIndex) =>
    MECHANISMS.slice(leftIndex + 1).map((right) => {
      const leftPasses = passingMechanisms.includes(left);
      const rightPasses = passingMechanisms.includes(right);
      return {
        pair: `${left}_${right}`,
        result:
          leftPasses && rightPasses
            ? ("unresolved" as const)
            : leftPasses
              ? ("left" as const)
              : rightPasses
                ? ("right" as const)
                : ("not_applicable" as const),
      };
    }),
  );
  return {
    comparisons,
    passingMechanisms,
    status:
      passingMechanisms.length === 1
        ? "unique"
        : passingMechanisms.length > 1
          ? "ambiguous"
          : "none",
    uniqueMechanism:
      passingMechanisms.length === 1 ? passingMechanisms[0] : null,
  };
}

function calculateEvidence(
  availability: NodeAvailabilityByRole,
  closure: RelationClosure,
  tension: TensionState,
  finalState: FinalState,
): EvidenceStates {
  const E1: EvidenceState = Object.values(availability).includes("unknown")
    ? "boundary_sensitive"
    : "established";
  const hasStructuralCompetition = closure.relations.some(
    (relation) =>
      relation.kind !== "same_role" && relation.limitedByCompetition,
  );
  const E2: EvidenceState = hasStructuralCompetition
    ? "conflicted"
    : tension === "candidate"
      ? "candidate"
      : tension === "not_supported"
        ? "not_supported"
        : "established";
  const sameRoleRelations = closure.relations.filter(
    (relation) => relation.kind === "same_role",
  );
  const E3: EvidenceState = sameRoleRelations.some(
    (relation) => relation.effectiveness === "effective",
  )
    ? "established"
    : sameRoleRelations.length > 0
      ? "candidate"
      : "not_supported";
  const E4: EvidenceState = tension;
  const E5 = finalState;
  const E6 = finalState;
  return { E1, E2, E3, E4, E5, E6 };
}

function aggregateNodeAvailability(
  results: readonly CandidateEvaluation[],
): NodeAvailabilityByRole {
  return Object.fromEntries(
    ROLES.map((role) => {
      const first = results[0].nodeAvailability[role];
      const same = results.every(
        (result) => result.nodeAvailability[role] === first,
      );
      return [role, same && first !== "unknown" ? first : "unknown"];
    }),
  ) as unknown as NodeAvailabilityByRole;
}

function aggregateDimensions(
  results: readonly CandidateEvaluation[],
): DimensionStates {
  return Object.fromEntries(
    DIMENSION_KEYS.map((key) => {
      const first = results[0].dimensions[key];
      return [
        key,
        results.every((result) => result.dimensions[key] === first)
          ? first
          : "unresolved",
      ];
    }),
  ) as unknown as DimensionStates;
}

function aggregateEvidence(
  results: readonly CandidateEvaluation[],
  stableCore: boolean,
): EvidenceStates {
  return Object.fromEntries(
    EVIDENCE_KEYS.map((key) => {
      if (key === "E6" && !stableCore) return [key, "boundary_sensitive"];
      const first = results[0].evidence[key];
      return [
        key,
        results.every((result) => result.evidence[key] === first)
          ? first
          : "boundary_sensitive",
      ];
    }),
  ) as unknown as EvidenceStates;
}

function sameCoreResult(
  left: CandidateEvaluation,
  right: CandidateEvaluation,
): boolean {
  return (
    left.coreMechanism === right.coreMechanism &&
    left.finalState === right.finalState &&
    arraysEqual(left.coreCandidates, right.coreCandidates)
  );
}

function deriveManifestationVariant(
  answers: readonly ManifestationAnswer[],
): StaticRuleEngineResult["manifestationVariant"] {
  if (answers.length === 0) return "unselected";
  return answers.some((answer) => answer.answer === "reverse")
    ? "reverse"
    : "selected";
}

function validateEngineInput(input: StaticRuleEngineInput): void {
  assertRecord(input, "input");
  assertExactKeys(
    input,
    ["timeBasisVersion", "candidates", "manifestationAnswers"],
    ["timeBasisVersion", "candidates"],
    "input",
  );
  if (input.timeBasisVersion !== "civil_time_v1") {
    throw new Error("input.timeBasisVersion must be civil_time_v1");
  }
  if (!Array.isArray(input.candidates) || input.candidates.length === 0) {
    throw new Error("input.candidates must be a non-empty finite array");
  }
  const candidateIds = new Set<string>();
  input.candidates.forEach((candidate, index) => {
    validateCandidate(candidate, `input.candidates[${index}]`);
    if (candidateIds.has(candidate.candidateId)) {
      throw new Error(`Duplicate candidateId: ${candidate.candidateId}`);
    }
    candidateIds.add(candidate.candidateId);
  });
  validateManifestationAnswers(input.manifestationAnswers ?? []);
}

function validateCandidate(candidate: ChartCandidate, path: string): void {
  assertRecord(candidate, path);
  assertExactKeys(candidate, ["candidateId", "facts"], ["candidateId", "facts"], path);
  assertNonEmptyString(candidate.candidateId, `${path}.candidateId`);
  validateChartFacts(candidate.facts, `${path}.facts`);
}

function validateChartFacts(facts: ChartFacts, path: string): void {
  assertRecord(facts, path);
  assertExactKeys(
    facts,
    [
      "precision",
      "missingPositions",
      "seasonalStrength",
      "occurrences",
      "branchContactFacts",
    ],
    ["precision", "missingPositions", "seasonalStrength", "occurrences"],
    path,
  );
  if (facts.precision !== "exact" && facts.precision !== "bounded") {
    throw new Error(`${path}.precision is unsupported`);
  }
  validateUniqueStringArray(facts.missingPositions, `${path}.missingPositions`);
  if (facts.branchContactFacts !== undefined) {
    if (!Array.isArray(facts.branchContactFacts)) {
      throw new Error(`${path}.branchContactFacts must be an array`);
    }
    if (facts.branchContactFacts.length > 0) {
      throw new Error(
        `${path}.branchContactFacts is unsupported by static-engine-v0.1`,
      );
    }
  }
  validateSeasonalStrength(facts.seasonalStrength, `${path}.seasonalStrength`);
  if (!Array.isArray(facts.occurrences) || facts.occurrences.length === 0) {
    throw new Error(`${path}.occurrences must be a non-empty array`);
  }
  const objectKeys = new Set<string>();
  let dayAnchorCount = 0;
  facts.occurrences.forEach((occurrence, index) => {
    const occurrencePath = `${path}.occurrences[${index}]`;
    validateOccurrence(occurrence, occurrencePath);
    if (objectKeys.has(occurrence.objectKey)) {
      throw new Error(`Duplicate objectKey: ${occurrence.objectKey}`);
    }
    objectKeys.add(occurrence.objectKey);
    if (occurrence.kind === "day_anchor") dayAnchorCount += 1;
  });
  if (dayAnchorCount !== 1) {
    throw new Error(`${path}.occurrences must contain exactly one day_anchor`);
  }
}

function validateSeasonalStrength(
  value: Readonly<Record<Role, SeasonalStrength>>,
  path: string,
): void {
  assertRecord(value, path);
  assertExactKeys(value, ROLES, ROLES, path);
  const allowed: readonly SeasonalStrength[] = [
    "旺",
    "相",
    "休",
    "囚",
    "死",
    "unknown",
  ];
  for (const role of ROLES) {
    if (!allowed.includes(value[role])) {
      throw new Error(`${path}.${role} is unsupported`);
    }
  }
}

function validateOccurrence(occurrence: Occurrence, path: string): void {
  assertRecord(occurrence, path);
  assertExactKeys(
    occurrence,
    [
      "role",
      "kind",
      "objectKey",
      "originClusterKey",
      "hiddenStemProportion",
      "rootOccurrence",
    ],
    [
      "role",
      "kind",
      "objectKey",
      "originClusterKey",
      "hiddenStemProportion",
      "rootOccurrence",
    ],
    path,
  );
  if (!ROLES.includes(occurrence.role)) {
    throw new Error(`${path}.role is unsupported`);
  }
  if (!["day_anchor", "visible", "hidden"].includes(occurrence.kind)) {
    throw new Error(`${path}.kind is unsupported`);
  }
  assertNonEmptyString(occurrence.objectKey, `${path}.objectKey`);
  assertNonEmptyString(
    occurrence.originClusterKey,
    `${path}.originClusterKey`,
  );
  if (typeof occurrence.rootOccurrence !== "boolean") {
    throw new Error(`${path}.rootOccurrence must be boolean`);
  }
  if (occurrence.kind === "hidden") {
    if (
      typeof occurrence.hiddenStemProportion !== "number" ||
      !Number.isFinite(occurrence.hiddenStemProportion) ||
      occurrence.hiddenStemProportion < 0 ||
      occurrence.hiddenStemProportion > 1
    ) {
      throw new Error(
        `${path}.hiddenStemProportion must be between 0 and 1 for hidden occurrences`,
      );
    }
  } else if (occurrence.hiddenStemProportion !== null) {
    throw new Error(
      `${path}.hiddenStemProportion must be null unless kind is hidden`,
    );
  }
  if (occurrence.rootOccurrence && occurrence.kind !== "hidden") {
    throw new Error(`${path}.rootOccurrence requires kind hidden`);
  }
  if (occurrence.kind === "day_anchor" && occurrence.role !== "subject") {
    throw new Error(`${path}.day_anchor must have role subject`);
  }
}

function validateManifestationAnswers(
  answers: readonly ManifestationAnswer[],
): void {
  if (!Array.isArray(answers) || answers.length > 3) {
    throw new Error("input.manifestationAnswers must contain at most 3 answers");
  }
  const questionIds = new Set<string>();
  answers.forEach((answer, index) => {
    const path = `input.manifestationAnswers[${index}]`;
    assertRecord(answer, path);
    assertExactKeys(answer, ["questionId", "answer"], ["questionId", "answer"], path);
    assertNonEmptyString(answer.questionId, `${path}.questionId`);
    assertNonEmptyString(answer.answer, `${path}.answer`);
    if (questionIds.has(answer.questionId)) {
      throw new Error(`Duplicate manifestation questionId: ${answer.questionId}`);
    }
    questionIds.add(answer.questionId);
  });
}

function assertRecord(value: unknown, path: string): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
}

function assertExactKeys(
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
  requiredKeys: readonly string[],
  path: string,
): void {
  const unknownKeys = Object.keys(value).filter(
    (key) => !allowedKeys.includes(key),
  );
  if (unknownKeys.length > 0) {
    throw new Error(`${path} contains unsupported field: ${unknownKeys[0]}`);
  }
  const missingKeys = requiredKeys.filter(
    (key) => !Object.prototype.hasOwnProperty.call(value, key),
  );
  if (missingKeys.length > 0) {
    throw new Error(`${path} is missing required field: ${missingKeys[0]}`);
  }
}

function assertNonEmptyString(value: unknown, path: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${path} must be a non-empty string`);
  }
}

function validateUniqueStringArray(value: unknown, path: string): void {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  const seen = new Set<string>();
  value.forEach((item, index) => {
    assertNonEmptyString(item, `${path}[${index}]`);
    if (seen.has(item)) throw new Error(`${path} contains duplicate value: ${item}`);
    seen.add(item);
  });
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function arraysEqual<T>(left: readonly T[], right: readonly T[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function deepFreeze<T>(value: T): T {
  if (typeof value !== "object" || value === null || Object.isFrozen(value)) {
    return value;
  }
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}
