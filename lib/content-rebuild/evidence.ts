import {
  MECHANISMS,
  ROLES,
  type ChartFacts,
  type DimensionEvaluation,
  type DimensionKey,
  type DimensionStates,
  type EvidenceGraph,
  type EvidenceNode,
  type EvidencePath,
  type EvidencePathId,
  type EvidenceState,
  type MechanismId,
  type NodeAvailability,
  type NodeAvailabilityByRole,
  type NormalizedRelation,
  type RelationClosure,
  type RelationEffectiveness,
  type RelationKind,
  type Role,
  type TensionState,
} from "./types";

interface DirectPathDefinition {
  readonly id: EvidencePathId;
  readonly kind: RelationKind;
  readonly sourceRole: Role;
  readonly targetRole: Role;
}

export interface E4Witness {
  readonly mechanism: MechanismId;
  readonly status: TensionState;
  readonly involvedObjectKeys: readonly string[];
  readonly originClusterKeys: readonly string[];
  readonly supportRelationKeys: readonly string[];
  readonly counterRelationKeys: readonly string[];
}

const DIRECT_PATHS: readonly DirectPathDefinition[] = [
  {
    id: "input_subject",
    kind: "generates",
    sourceRole: "input",
    targetRole: "subject",
  },
  {
    id: "subject_output",
    kind: "generates",
    sourceRole: "subject",
    targetRole: "output",
  },
  {
    id: "output_resource",
    kind: "generates",
    sourceRole: "output",
    targetRole: "resource",
  },
  {
    id: "output_constraint",
    kind: "controls",
    sourceRole: "output",
    targetRole: "constraint",
  },
  {
    id: "constraint_subject",
    kind: "controls",
    sourceRole: "constraint",
    targetRole: "subject",
  },
  {
    id: "constraint_input",
    kind: "generates",
    sourceRole: "constraint",
    targetRole: "input",
  },
] as const;

export function buildEvidenceGraph(
  facts: ChartFacts,
  availability: NodeAvailabilityByRole,
  closure: RelationClosure,
): EvidenceGraph {
  const roleNodes = ROLES.map((role) =>
    buildRoleNode(facts, availability, role),
  );
  const relationNodes = closure.sourceDedupedRelations.map(buildRelationNode);
  const directPaths = DIRECT_PATHS.flatMap((definition) =>
    closure.relations
      .filter(
        (relation) =>
          relation.kind === definition.kind &&
          relation.sourceRole === definition.sourceRole &&
          relation.targetRole === definition.targetRole,
      )
      .map((relation) => buildDirectPath(definition.id, relation)),
  );
  const compoundPaths = buildCompoundPaths(directPaths);
  const paths = [...directPaths, ...compoundPaths].sort((left, right) =>
    left.key.localeCompare(right.key),
  );
  const e4Nodes = MECHANISMS.map((mechanism) =>
    buildE4Node(mechanism, paths),
  );

  const E1: EvidenceState = roleNodes.some(
    (node) => node.structuralStatus === "unknown",
  )
    ? "boundary_sensitive"
    : "established";
  const E2 = calculateClosureEvidence(paths, closure);
  const E4 = aggregateStructuralEvidence(e4Nodes.map((node) => node.status));
  const sameRoleNodes = relationNodes.filter((node) => node.layer === "E3");
  const E3: EvidenceState = sameRoleNodes.some(
    (node) => node.status === "established",
  )
    ? "established"
    : sameRoleNodes.some((node) => node.status === "conflicted")
      ? "conflicted"
      : sameRoleNodes.some((node) => node.status === "boundary_sensitive")
        ? "boundary_sensitive"
        : sameRoleNodes.some((node) => node.status === "candidate")
          ? "candidate"
          : "not_supported";

  return {
    nodes: [...roleNodes, ...relationNodes, ...e4Nodes],
    paths,
    layers: { E1, E2, E3, E4 },
    roleNodeIds: Object.fromEntries(
      ROLES.map((role) => [role, `role:${role}`]),
    ) as unknown as EvidenceGraph["roleNodeIds"],
    e4NodeIds: Object.fromEntries(
      MECHANISMS.map((mechanism) => [mechanism, `e4:${mechanism}`]),
    ) as unknown as EvidenceGraph["e4NodeIds"],
  };
}

function buildRoleNode(
  facts: ChartFacts,
  availability: NodeAvailabilityByRole,
  role: Role,
): EvidenceNode {
  const occurrences = facts.occurrences.filter(
    (occurrence) => occurrence.role === role,
  );
  const structuralStatus = availabilityToStructuralStatus(availability[role]);
  return {
    id: `role:${role}`,
    layer: "E1",
    mechanism: null,
    evidenceFamily: "node_availability",
    originClusterKeys: sortedUnique(
      occurrences.map((occurrence) => occurrence.originClusterKey),
    ),
    involvedObjectKeys: sortedUnique(
      occurrences.map((occurrence) => occurrence.objectKey),
    ),
    supportRelationKeys: [],
    counterRelationKeys: [],
    status:
      structuralStatus === "effective"
        ? "established"
        : structuralStatus === "limited"
          ? "candidate"
          : structuralStatus === "unknown"
            ? "boundary_sensitive"
            : "not_supported",
    structuralStatus,
    visible: occurrences.some((occurrence) => occurrence.kind === "visible"),
  };
}

function buildRelationNode(relation: NormalizedRelation): EvidenceNode {
  const conflicted = relation.competesForInterface;
  return {
    id: `relation:${relation.canonicalRelationKey}`,
    layer: relation.kind === "same_role" ? "E3" : "E2",
    mechanism: null,
    evidenceFamily: "complete_relation_closure",
    originClusterKeys: relation.originClusterKeys,
    involvedObjectKeys: sortedUnique([
      relation.sourceObjectKey,
      relation.targetObjectKey,
    ]),
    supportRelationKeys: [relation.canonicalRelationKey],
    counterRelationKeys: conflicted ? [relation.canonicalRelationKey] : [],
    status: conflicted
      ? "conflicted"
      : structuralStatusToEvidenceState(relation.effectiveness),
    structuralStatus: relation.effectiveness,
    visible: null,
  };
}

function buildDirectPath(
  id: EvidencePathId,
  relation: NormalizedRelation,
): EvidencePath {
  const counterRelationKeys = relation.competesForInterface
    ? [relation.canonicalRelationKey]
    : [];
  return {
    key: `path:${id}:${relation.canonicalRelationKey}`,
    id,
    evidenceFamily: "complete_relation_closure",
    originClusterKeys: relation.originClusterKeys,
    involvedObjectKeys: sortedUnique([
      relation.sourceObjectKey,
      relation.targetObjectKey,
    ]),
    supportRelationKeys: [relation.canonicalRelationKey],
    counterRelationKeys,
    status:
      counterRelationKeys.length > 0
        ? "conflicted"
        : structuralStatusToEvidenceState(relation.effectiveness),
    structuralStatus: relation.effectiveness,
    roleSequence: [relation.sourceRole, relation.targetRole],
    objectPath: [relation.sourceObjectKey, relation.targetObjectKey],
    originPath: [
      relation.sourceOriginClusterKey,
      relation.targetOriginClusterKey,
    ],
    competesForInterface: relation.competesForInterface,
    limitedByCompetition: relation.limitedByCompetition,
  };
}

function buildCompoundPaths(
  directPaths: readonly EvidencePath[],
): EvidencePath[] {
  const inputSubject = directPaths.filter(
    (path) => path.id === "input_subject",
  );
  const subjectOutput = directPaths.filter(
    (path) => path.id === "subject_output",
  );
  const outputResource = directPaths.filter(
    (path) => path.id === "output_resource",
  );
  const outputConstraint = directPaths.filter(
    (path) => path.id === "output_constraint",
  );
  const constraintInput = directPaths.filter(
    (path) => path.id === "constraint_input",
  );

  const outputMediated = joinPaths(
    "output_mediated",
    subjectOutput,
    outputConstraint,
  );
  const inputMediated = joinPaths(
    "input_mediated",
    constraintInput,
    inputSubject,
  );
  const inputSubjectOutput = joinPaths(
    "conversion",
    inputSubject,
    subjectOutput,
  );
  const conversion = joinPaths(
    "conversion",
    inputSubjectOutput,
    outputResource,
  );

  return [...outputMediated, ...inputMediated, ...conversion];
}

function joinPaths(
  id: EvidencePathId,
  leftPaths: readonly EvidencePath[],
  rightPaths: readonly EvidencePath[],
): EvidencePath[] {
  const joined: EvidencePath[] = [];
  for (const left of leftPaths) {
    for (const right of rightPaths) {
      const leftObject = left.objectPath.at(-1);
      const rightObject = right.objectPath[0];
      const leftOrigin = left.originPath.at(-1);
      const rightOrigin = right.originPath[0];
      if (
        leftObject === undefined ||
        leftObject !== rightObject ||
        leftOrigin === undefined ||
        leftOrigin !== rightOrigin
      ) {
        continue;
      }
      const structuralStatus = combineStructuralStatuses([
        left.structuralStatus,
        right.structuralStatus,
      ]);
      const limitedByCompetition =
        left.limitedByCompetition || right.limitedByCompetition;
      const competesForInterface =
        left.competesForInterface || right.competesForInterface;
      const objectPath = [...left.objectPath, ...right.objectPath.slice(1)];
      const originPath = [...left.originPath, ...right.originPath.slice(1)];
      const supportRelationKeys = sortedUnique([
        ...left.supportRelationKeys,
        ...right.supportRelationKeys,
      ]);
      const counterRelationKeys = sortedUnique([
        ...left.counterRelationKeys,
        ...right.counterRelationKeys,
      ]);
      joined.push({
        key: `path:${id}:${objectPath.join(">")}:${supportRelationKeys.join("+")}`,
        id,
        evidenceFamily: "complete_relation_closure",
        originClusterKeys: sortedUnique(originPath),
        involvedObjectKeys: sortedUnique(objectPath),
        supportRelationKeys,
        counterRelationKeys,
        status: competesForInterface
          ? "conflicted"
          : structuralStatusToEvidenceState(structuralStatus),
        structuralStatus,
        roleSequence: [...left.roleSequence, ...right.roleSequence.slice(1)],
        objectPath,
        originPath,
        competesForInterface,
        limitedByCompetition,
      });
    }
  }
  return joined;
}

function buildE4Node(
  mechanism: MechanismId,
  paths: readonly EvidencePath[],
): EvidenceNode {
  const witness = findE4Witness(mechanism, paths);
  const status: TensionState = witness?.status ?? "not_supported";

  return {
    id: `e4:${mechanism}`,
    layer: "E4",
    mechanism,
    evidenceFamily: "same_origin_tension",
    originClusterKeys: witness?.originClusterKeys ?? [],
    involvedObjectKeys: witness?.involvedObjectKeys ?? [],
    supportRelationKeys: witness?.supportRelationKeys ?? [],
    counterRelationKeys: witness?.counterRelationKeys ?? [],
    status,
    structuralStatus:
      status === "established"
        ? "effective"
        : status === "candidate" || status === "conflicted"
          ? "limited"
          : "blocked",
    visible: null,
  };
}

export function findE4Witness(
  mechanism: MechanismId,
  paths: readonly EvidencePath[],
): E4Witness | null {
  const subjectOutput = selectPaths(paths, "subject_output");
  const outputResource = selectPaths(paths, "output_resource");
  const outputConstraint = selectPaths(paths, "output_constraint");
  const constraintSubject = selectPaths(paths, "constraint_subject");
  const witnesses: E4Witness[] = [];

  if (mechanism === "A01" || mechanism === "A04") {
    for (const first of subjectOutput) {
      for (const second of outputResource) {
        if (!sharesTargetWithSource(first, second)) continue;
        const status = pairE4Status(mechanism, first, second);
        if (status === "not_supported") continue;
        witnesses.push(createWitness(mechanism, status, [first, second]));
      }
    }
  } else {
    for (const first of subjectOutput) {
      for (const second of outputConstraint) {
        if (!sharesTargetWithSource(first, second)) continue;
        for (const third of constraintSubject) {
          if (
            !sharesTargetWithSource(second, third) ||
            (mechanism === "A02" &&
              (third.objectPath.at(-1) !== first.objectPath[0] ||
                third.originPath.at(-1) !== first.originPath[0]))
          ) {
            continue;
          }
          const status = triangleE4Status(
            mechanism,
            first,
            second,
            third,
          );
          if (status === "not_supported") continue;
          witnesses.push(
            createWitness(mechanism, status, [first, second, third]),
          );
        }
      }
    }
  }

  return (
    witnesses.sort((left, right) => {
      const rankDifference =
        tensionRank(right.status) - tensionRank(left.status);
      if (rankDifference !== 0) return rankDifference;
      return left.supportRelationKeys
        .join("|")
        .localeCompare(right.supportRelationKeys.join("|"));
    })[0] ?? null
  );
}

function pairE4Status(
  mechanism: "A01" | "A04",
  first: EvidencePath,
  second: EvidencePath,
): TensionState {
  if (first.competesForInterface || second.competesForInterface) {
    return "conflicted";
  }
  if (
    first.structuralStatus === "unknown" ||
    second.structuralStatus === "unknown"
  ) {
    return "not_supported";
  }
  if (mechanism === "A01") {
    if (
      first.structuralStatus === "effective" &&
      ["limited", "blocked"].includes(second.structuralStatus)
    ) {
      return "established";
    }
    if (
      ["effective", "limited"].includes(first.structuralStatus) &&
      ["limited", "blocked"].includes(second.structuralStatus)
    ) {
      return "candidate";
    }
    return "not_supported";
  }
  if (
    first.structuralStatus === "effective" &&
    second.structuralStatus === "effective"
  ) {
    return "established";
  }
  if (
    ["effective", "limited"].includes(first.structuralStatus) &&
    ["effective", "limited"].includes(second.structuralStatus)
  ) {
    return "candidate";
  }
  return "not_supported";
}

function triangleE4Status(
  mechanism: "A02" | "A03",
  first: EvidencePath,
  second: EvidencePath,
  third: EvidencePath,
): TensionState {
  const paths = [first, second, third];
  if (paths.some((path) => path.competesForInterface)) {
    return "conflicted";
  }
  if (
    paths.some(
      (path) =>
        path.structuralStatus === "unknown" ||
        path.structuralStatus === "blocked",
    )
  ) {
    return "not_supported";
  }
  const states = paths.map((path) => path.structuralStatus);
  if (mechanism === "A02") {
    if (
      states[0] === "limited" &&
      states[1] === "effective" &&
      states[2] === "limited"
    ) {
      return "established";
    }
    return states[0] === "limited" ? "candidate" : "not_supported";
  }
  if (states.every((state) => state === "effective")) return "established";
  return states.some((state) => state === "limited")
    ? "candidate"
    : "not_supported";
}

function createWitness(
  mechanism: MechanismId,
  status: TensionState,
  paths: readonly EvidencePath[],
): E4Witness {
  return {
    mechanism,
    status,
    involvedObjectKeys: sortedUnique(
      paths.flatMap((path) => path.involvedObjectKeys),
    ),
    originClusterKeys: sortedUnique(
      paths.flatMap((path) => path.originClusterKeys),
    ),
    supportRelationKeys: sortedUnique(
      paths.flatMap((path) => path.supportRelationKeys),
    ),
    counterRelationKeys: sortedUnique(
      paths.flatMap((path) => path.counterRelationKeys),
    ),
  };
}

function sharesTargetWithSource(
  left: EvidencePath,
  right: EvidencePath,
): boolean {
  return (
    left.objectPath.at(-1) === right.objectPath[0] &&
    left.originPath.at(-1) === right.originPath[0]
  );
}

function selectPaths(
  paths: readonly EvidencePath[],
  id: EvidencePathId,
): EvidencePath[] {
  return paths.filter(
    (path) => path.id === id && path.roleSequence.length === 2,
  );
}

export function calculateClosureEvidence(
  paths: readonly EvidencePath[],
  closure: RelationClosure,
): EvidenceState {
  if (Object.values(closure.diagnostics).some((count) => count !== 0)) {
    return "conflicted";
  }
  if (paths.some((path) => path.competesForInterface)) return "conflicted";

  const A01 = calculateA01ClosureClaim(paths);
  const otherClaims = (["A02", "A03", "A04"] as const).map(
    (mechanism) => findE4Witness(mechanism, paths)?.status ?? "not_supported",
  );
  return aggregateStructuralEvidence([A01, ...otherClaims]);
}

function calculateA01ClosureClaim(
  paths: readonly EvidencePath[],
): TensionState {
  const witness = findE4Witness("A01", paths);
  if (!witness) return "not_supported";
  if (witness.status === "conflicted") return "conflicted";
  const supply = aggregatePathStatus(paths, "input_subject");
  if (witness.status === "established" && supply === "effective") {
    return "established";
  }
  if (
    ["established", "candidate"].includes(witness.status) &&
    supply === "limited"
  ) {
    return "candidate";
  }
  return "not_supported";
}

export function calculateDimensionsFromEvidence(
  graph: EvidenceGraph,
): DimensionEvaluation {
  const availability = Object.fromEntries(
    ROLES.map((role) => [role, graphRoleAvailability(graph, role)]),
  ) as unknown as NodeAvailabilityByRole;
  const inputSubject = aggregatePathStatus(graph.paths, "input_subject");
  const subjectOutput = aggregatePathStatus(graph.paths, "subject_output");
  const outputResource = aggregatePathStatus(graph.paths, "output_resource");
  const outputConstraint = aggregatePathStatus(
    graph.paths,
    "output_constraint",
  );
  const constraintSubject = aggregatePathStatus(
    graph.paths,
    "constraint_subject",
  );
  const outputMediated = aggregatePathStatus(graph.paths, "output_mediated");
  const inputMediated = aggregatePathStatus(graph.paths, "input_mediated");

  const states: DimensionStates = {
    D1: supplyDimension(availability, inputSubject),
    D2: outputCapacityDimension(
      graphRoleVisible(graph, "output"),
      availability,
      subjectOutput,
    ),
    D3: constraintMediationDimension(
      availability,
      outputMediated,
      inputMediated,
      constraintSubject,
    ),
    D4: conversionDimension(
      availability,
      aggregatePathStatus(graph.paths, "conversion"),
    ),
    D5: feedbackDimension(
      availability,
      subjectOutput,
      outputConstraint,
      constraintSubject,
      graph.paths,
    ),
    D6: resourceInterfaceDimension(availability, outputResource),
  };

  const D3Evidence =
    states.D3 === "constraint_mediated_by_output"
      ? evidenceIds(
          graph,
          ["constraint", "subject", "output"],
          ["output_mediated"],
        )
      : states.D3 === "constraint_mediated_by_input"
        ? evidenceIds(
            graph,
            ["constraint", "input", "subject"],
            ["input_mediated"],
          )
        : states.D3 === "mixed"
          ? evidenceIds(
              graph,
              ["constraint", "input", "subject", "output"],
              ["output_mediated", "input_mediated"],
            )
          : states.D3 === "direct_only"
            ? evidenceIds(
                graph,
                ["constraint", "subject"],
                ["constraint_subject"],
              )
            : evidenceIds(
                graph,
                ["constraint", "input", "subject", "output"],
                [
                  "output_mediated",
                  "input_mediated",
                  "constraint_subject",
                ],
              );
  const supportingEvidenceIds = {
    D1: evidenceIds(graph, ["input", "subject"], ["input_subject"]),
    D2: evidenceIds(graph, ["subject", "output"], ["subject_output"]),
    D3: D3Evidence,
    D4: evidenceIds(
      graph,
      ["input", "subject", "output", "resource"],
      ["conversion"],
    ),
    D5: evidenceIds(
      graph,
      ["subject", "output", "constraint"],
      ["subject_output", "output_constraint", "constraint_subject"],
    ),
    D6: evidenceIds(graph, ["output", "resource"], ["output_resource"]),
  } satisfies Record<DimensionKey, readonly string[]>;

  return { states, supportingEvidenceIds };
}

function graphRoleAvailability(
  graph: EvidenceGraph,
  role: Role,
): NodeAvailability {
  const node = graph.nodes.find((item) => item.id === graph.roleNodeIds[role]);
  if (!node || node.layer !== "E1" || node.structuralStatus === null) {
    throw new Error(`EvidenceGraph is missing role node: ${role}`);
  }
  if (node.structuralStatus === "effective") return "usable";
  if (node.structuralStatus === "limited") return "limited";
  if (node.structuralStatus === "blocked") return "absent";
  return "unknown";
}

function graphRoleVisible(graph: EvidenceGraph, role: Role): boolean {
  const node = graph.nodes.find((item) => item.id === graph.roleNodeIds[role]);
  if (!node || node.layer !== "E1") {
    throw new Error(`EvidenceGraph is missing role node: ${role}`);
  }
  return node.visible === true;
}

function evidenceIds(
  graph: EvidenceGraph,
  roles: readonly Role[],
  pathIds: readonly EvidencePathId[],
): readonly string[] {
  return sortedUnique([
    ...roles.map((role) => graph.roleNodeIds[role]),
    ...graph.paths
      .filter((path) => pathIds.includes(path.id))
      .map((path) => path.key),
  ]);
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
  outputVisible: boolean,
  availability: NodeAvailabilityByRole,
  edge: RelationEffectiveness,
): DimensionStates["D2"] {
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
  outputMediated: RelationEffectiveness,
  inputMediated: RelationEffectiveness,
  direct: RelationEffectiveness,
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
  conversion: RelationEffectiveness,
): DimensionStates["D4"] {
  const roles: readonly Role[] = ["input", "subject", "output", "resource"];
  if (
    roles.some((role) => availability[role] === "unknown") ||
    conversion === "unknown"
  ) {
    return "unresolved";
  }
  if (
    roles.some((role) => availability[role] === "absent") ||
    conversion === "blocked"
  ) {
    return "conversion_blocked";
  }
  if (
    roles.every((role) => availability[role] === "usable") &&
    conversion === "effective"
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
  paths: readonly EvidencePath[],
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
    paths.some(
      (path) =>
        ["output_constraint", "constraint_subject"].includes(path.id) &&
        path.competesForInterface,
    )
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

export function aggregatePathStatus(
  paths: readonly EvidencePath[],
  id: EvidencePathId,
): RelationEffectiveness {
  const matches = paths.filter((path) => path.id === id);
  if (matches.length === 0) return "blocked";
  return combineStructuralStatuses(
    matches.map((path) => path.structuralStatus),
  );
}

function combineStructuralStatuses(
  statuses: readonly RelationEffectiveness[],
): RelationEffectiveness {
  if (statuses.length === 0 || statuses.includes("blocked")) return "blocked";
  if (statuses.includes("unknown")) return "unknown";
  if (statuses.every((status) => status === "effective")) return "effective";
  return "limited";
}

function availabilityToStructuralStatus(
  availability: NodeAvailability,
): RelationEffectiveness {
  if (availability === "usable") return "effective";
  if (availability === "limited") return "limited";
  if (availability === "absent") return "blocked";
  return "unknown";
}

function structuralStatusToEvidenceState(
  status: RelationEffectiveness,
): EvidenceState {
  if (status === "effective") return "established";
  if (status === "limited") return "candidate";
  if (status === "blocked") return "not_supported";
  return "boundary_sensitive";
}

function aggregateStructuralEvidence(
  states: readonly EvidenceState[],
): EvidenceState {
  if (states.includes("conflicted")) return "conflicted";
  if (states.includes("established")) return "established";
  if (states.includes("candidate")) return "candidate";
  if (states.includes("boundary_sensitive")) return "boundary_sensitive";
  return "not_supported";
}

function tensionRank(status: TensionState): number {
  if (status === "conflicted") return 4;
  if (status === "established") return 3;
  if (status === "candidate") return 2;
  return 1;
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
