import { evaluateCandidateDecision } from "./decision";
import {
  buildEvidenceGraph,
  calculateDimensionsFromEvidence,
} from "./evidence";
import {
  ROLES,
  type CandidateEvaluation,
  type ChartCandidate,
  type ChartFacts,
  type DimensionKey,
  type DimensionStates,
  type EvidenceKey,
  type EvidenceSourceData,
  type EvidenceState,
  type EvidenceStates,
  type ManifestationAnswer,
  type MechanismId,
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
} from "./types";

const CANDIDATE_EVIDENCE_KEYS = ["E1", "E2", "E3", "E4", "E5"] as const;
const DIMENSION_KEYS: readonly DimensionKey[] = [
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
];
const SEASONAL_SCORES: Record<Exclude<SeasonalStrength, "unknown">, number> = {
  旺: 2,
  相: 1,
  休: 0,
  囚: -1,
  死: -2,
};

type RoleCategory = "self" | "input" | "output" | "resource" | "constraint";

interface RelationWithoutEffectiveness {
  readonly kind: RelationKind;
  readonly sourceObjectKey: string;
  readonly targetObjectKey: string;
  readonly sourceRole: Role;
  readonly targetRole: Role;
  readonly sourceOriginClusterKey: string;
  readonly targetOriginClusterKey: string;
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
  readonly candidateStabilityEvidence: EvidenceSourceData;
  readonly dimensions: DimensionStates;
  readonly coreCandidates: readonly MechanismId[];
  readonly coreMechanism: MechanismId | null;
  readonly finalState: EvidenceState;
}

export function evaluateContentRebuild(
  input: StaticRuleEngineInput,
): StaticRuleEngineResult {
  validateEngineInput(input);

  // Manifestation answers are deliberately unavailable to every core stage.
  const core = evaluateCore(input.timeBasisVersion, input.candidates);
  const manifestationVariant = deriveManifestationVariant(
    input.manifestationAnswers ?? [],
  );

  return deepFreeze({ ...core, manifestationVariant });
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
  const stability = aggregateCandidateStability(candidateResults);
  const evidence = aggregateEvidence(candidateResults, stability.E6);

  if (stability.E6 === "boundary_sensitive") {
    return {
      timeBasisVersion,
      candidateResults,
      nodeAvailability: aggregateNodeAvailability(candidateResults),
      evidence,
      candidateStabilityEvidence: stability.evidence,
      dimensions: aggregateDimensions(candidateResults),
      coreCandidates: sortedUnique(
        candidateResults.flatMap((result) => result.coreCandidates),
      ) as MechanismId[],
      coreMechanism: null,
      finalState: "boundary_sensitive",
    };
  }

  const first = candidateResults[0];
  return {
    timeBasisVersion,
    candidateResults,
    nodeAvailability: aggregateNodeAvailability(candidateResults),
    evidence,
    candidateStabilityEvidence: stability.evidence,
    dimensions: aggregateDimensions(candidateResults),
    coreCandidates: first.coreCandidates,
    coreMechanism: first.coreMechanism,
    finalState: stability.E6,
  };
}

function evaluateCandidate(candidate: ChartCandidate): CandidateEvaluation {
  const nodeAvailability = calculateNodeAvailability(candidate.facts);
  const closure = buildRelationClosure(candidate.facts, nodeAvailability);
  const evidenceGraph = buildEvidenceGraph(
    candidate.facts,
    nodeAvailability,
    closure,
  );
  const dimensionEvaluation = calculateDimensionsFromEvidence(evidenceGraph);
  const decision = evaluateCandidateDecision(
    evidenceGraph,
    dimensionEvaluation,
  );

  return {
    candidateId: candidate.candidateId,
    nodeAvailability,
    closure,
    evidenceGraph,
    evidence: decision.evidence,
    dimensions: dimensionEvaluation.states,
    dimensionEvidence: dimensionEvaluation.supportingEvidenceIds,
    decisionEvidence: decision.decisionEvidence,
    evidenceFamilies: decision.evidenceFamilies,
    originClusterKeys: decision.originClusterKeys,
    tensions: decision.tensions,
    tension: decision.tension,
    mechanismEvaluations: decision.mechanismEvaluations,
    exclusion: decision.exclusion,
    nearestNeighbor: decision.nearestNeighbor,
    coreCandidates: decision.coreCandidates,
    coreMechanism: decision.coreMechanism,
    candidateState: decision.candidateState,
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
    throw new Error("Relation closure generated duplicate canonical keys");
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
    if (relation.kind === "same_role") continue;
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
    const competesForInterface = competitionSourceKeys.has(
      relation.sourceDedupeKey,
    );
    const limitedByCompetition = base === "effective" && competesForInterface;
    return {
      ...relation,
      effectiveness: limitedByCompetition ? "limited" : base,
      competesForInterface,
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
  throw new Error(`Unsupported role relation pair: ${left.role}/${right.role}`);
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
  return {
    kind,
    sourceObjectKey: source.objectKey,
    targetObjectKey: target.objectKey,
    sourceRole: source.role,
    targetRole: target.role,
    sourceOriginClusterKey: source.originClusterKey,
    targetOriginClusterKey: target.originClusterKey,
    direction,
    canonicalRelationKey: `${kind}:${source.objectKey}>${target.objectKey}`,
    originClusterKeys: sortedUnique([
      source.originClusterKey,
      target.originClusterKey,
    ]),
    sourceDedupeKey: [
      kind,
      source.role,
      target.role,
      source.originClusterKey,
      target.originClusterKey,
    ].join(":"),
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

function aggregateCandidateStability(
  results: readonly CandidateEvaluation[],
): { readonly E6: EvidenceState; readonly evidence: EvidenceSourceData } {
  let E6: EvidenceState;
  if (
    results.some(
      (result) =>
        Object.values(result.nodeAvailability).includes("unknown") ||
        result.closure.relations.some(
          (relation) => relation.effectiveness === "unknown",
        ),
    )
  ) {
    E6 = "boundary_sensitive";
  } else {
    const first = results[0];
    const sameCore = results.every(
      (result) =>
        result.evidence.E5 === first.evidence.E5 &&
        result.coreMechanism === first.coreMechanism &&
        arraysEqual(result.coreCandidates, first.coreCandidates),
    );
    if (!sameCore) {
      E6 = "boundary_sensitive";
    } else if (
      first.evidence.E5 === "established" &&
      first.coreMechanism !== null
    ) {
      E6 = "established";
    } else {
      E6 = first.evidence.E5;
    }
  }
  const paths = results.flatMap((result) => result.evidenceGraph.paths);
  const decisionNodes = results.flatMap((result) => result.decisionEvidence);
  return {
    E6,
    evidence: {
      evidenceFamily: "candidate_stability",
      originClusterKeys: sortedUnique(
        results.flatMap((result) => result.originClusterKeys),
      ),
      involvedObjectKeys: sortedUnique(
        paths.flatMap((path) => path.involvedObjectKeys),
      ),
      supportRelationKeys: sortedUnique(
        paths.flatMap((path) => path.supportRelationKeys),
      ),
      counterRelationKeys: sortedUnique(
        decisionNodes.flatMap((node) => node.counterRelationKeys),
      ),
      status: E6,
    },
  };
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
  E6: EvidenceState,
): EvidenceStates {
  const entries = CANDIDATE_EVIDENCE_KEYS.map((key) => {
    const first = results[0].evidence[key];
    return [
      key,
      results.every((result) => result.evidence[key] === first)
        ? first
        : "boundary_sensitive",
    ] as const;
  });
  return Object.fromEntries([
    ...entries,
    ["E6" satisfies EvidenceKey, E6] as const,
  ]) as unknown as EvidenceStates;
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
  assertExactKeys(
    candidate,
    ["candidateId", "facts"],
    ["candidateId", "facts"],
    path,
  );
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
    assertExactKeys(
      answer,
      ["questionId", "answer"],
      ["questionId", "answer"],
      path,
    );
    assertNonEmptyString(answer.questionId, `${path}.questionId`);
    assertNonEmptyString(answer.answer, `${path}.answer`);
    if (questionIds.has(answer.questionId)) {
      throw new Error(`Duplicate manifestation questionId: ${answer.questionId}`);
    }
    questionIds.add(answer.questionId);
  });
}

function assertRecord(
  value: unknown,
  path: string,
): asserts value is Record<string, unknown> {
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

function assertNonEmptyString(
  value: unknown,
  path: string,
): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${path} must be a non-empty string`);
  }
}

function validateUniqueStringArray(value: unknown, path: string): void {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  const seen = new Set<string>();
  value.forEach((item, index) => {
    assertNonEmptyString(item, `${path}[${index}]`);
    if (seen.has(item)) {
      throw new Error(`${path} contains duplicate value: ${item}`);
    }
    seen.add(item);
  });
}

function sortedUnique<T extends string>(values: readonly T[]): T[] {
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
