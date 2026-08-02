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
  type InterfacePath,
  type MechanismId,
  type NodeAvailability,
  type NodeAvailabilityByRole,
  type NormalizedRelation,
  type RelationClosure,
  type RelationEffectiveness,
  type RelationInterfaceProjection,
  type Role,
  type TensionState,
} from "./types";
import {
  interfacePathStateToEffectiveness,
  ordinalCompare,
} from "./relation-interface";

type DecisionPathState =
  | "effective"
  | "limited"
  | "blocked"
  | "unknown"
  | "conflicted";

const PATH_ROLE_SEQUENCES: Readonly<Record<EvidencePathId, readonly Role[]>> = {
  input_subject: ["input", "subject"],
  subject_output: ["subject", "output"],
  output_resource: ["output", "resource"],
  output_constraint: ["output", "constraint"],
  constraint_subject: ["constraint", "subject"],
  constraint_input: ["constraint", "input"],
  output_mediated: ["subject", "output", "constraint"],
  input_mediated: ["constraint", "input", "subject"],
  conversion: ["input", "subject", "output", "resource"],
  output_constraint_feedback: [
    "subject",
    "output",
    "constraint",
    "subject",
  ],
};

export function buildEvidenceGraph(
  facts: ChartFacts,
  availability: NodeAvailabilityByRole,
  closure: RelationClosure,
  projection: RelationInterfaceProjection,
): EvidenceGraph {
  const roleNodes = ROLES.map((role) =>
    buildRoleNode(facts, availability, role),
  );
  const relationsBySourceDedupeKey = new Map<string, NormalizedRelation[]>();
  for (const relation of closure.relations) {
    const group = relationsBySourceDedupeKey.get(relation.sourceDedupeKey) ?? [];
    group.push(relation);
    relationsBySourceDedupeKey.set(relation.sourceDedupeKey, group);
  }
  const relationNodes = closure.sourceDedupedRelations.map((representative) => {
    const atomicRelations = relationsBySourceDedupeKey.get(
      representative.sourceDedupeKey,
    );
    if (!atomicRelations) {
      throw new Error(
        `Missing atomic provenance for ${representative.sourceDedupeKey}`,
      );
    }
    return buildRelationNode(representative, atomicRelations);
  });
  const paths = Object.values(projection.paths).map(buildEvidencePath);
  const e4Nodes = MECHANISMS.map((mechanism) =>
    buildE4Node(mechanism, projection),
  );

  const E1: EvidenceState = roleNodes.some(
    (node) => node.structuralStatus === "unknown",
  )
    ? "boundary_sensitive"
    : "established";
  const E2 = calculateClosureEvidence(paths, closure, projection.E4);
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

function buildRelationNode(
  representative: NormalizedRelation,
  atomicRelations: readonly NormalizedRelation[],
): EvidenceNode {
  if (
    atomicRelations.some(
      (relation) => relation.effectiveness !== representative.effectiveness,
    )
  ) {
    throw new Error(
      `Source-deduped relations disagree on effectiveness: ${representative.sourceDedupeKey}`,
    );
  }
  return {
    id: `relation:${representative.canonicalRelationKey}`,
    layer: representative.kind === "same_role" ? "E3" : "E2",
    mechanism: null,
    evidenceFamily: "complete_relation_closure",
    originClusterKeys: sortedUnique(
      atomicRelations.flatMap((relation) => relation.originClusterKeys),
    ),
    involvedObjectKeys: sortedUnique(
      atomicRelations.flatMap((relation) => [
        relation.sourceObjectKey,
        relation.targetObjectKey,
      ]),
    ),
    supportRelationKeys: sortedUnique(
      atomicRelations.map((relation) => relation.canonicalRelationKey),
    ),
    counterRelationKeys: [],
    status: structuralStatusToEvidenceState(representative.effectiveness),
    structuralStatus: representative.effectiveness,
    visible: null,
  };
}

function buildEvidencePath(path: InterfacePath): EvidencePath {
  const representative = path.witnesses[0];
  const structuralStatus = interfacePathStateToEffectiveness(path.baseState);
  if (structuralStatus === "conflicted") {
    throw new Error("Interface path base state cannot be conflicted");
  }
  return {
    key: `path:${path.pathKey}`,
    id: path.pathKey,
    pathKey: path.pathKey,
    interfaceKeys: path.interfaceKeys,
    baseState: path.baseState,
    state: path.state,
    witnessKeys: path.witnessKeys,
    witnesses: path.witnesses,
    atomicWitnessCount: path.atomicWitnessCount,
    representativeAtomicWitness: path.representativeAtomicWitness,
    contributorKeys: path.contributorKeys,
    atomicRelationKeys: path.atomicRelationKeys,
    contentionFactKeys: path.contentionFactKeys,
    evidenceFamily: "complete_relation_closure",
    originClusterKeys: path.originClusterKeys,
    involvedObjectKeys: path.involvedObjectKeys,
    supportRelationKeys: path.atomicRelationKeys,
    counterRelationKeys: path.counterRelationKeys,
    status: interfacePathStateToEvidenceState(path.state),
    structuralStatus,
    roleSequence: PATH_ROLE_SEQUENCES[path.pathKey],
    objectPath: representative?.objectPath ?? [],
    originPath: representative?.originPath ?? [],
  };
}

function buildE4Node(
  mechanism: MechanismId,
  projection: RelationInterfaceProjection,
): EvidenceNode {
  const witnesses = projection.e4Witnesses[mechanism];
  const status = projection.E4[mechanism];
  const aggregateWitnesses = witnesses.filter(
    (witness) => witness.state === status,
  );

  return {
    id: `e4:${mechanism}`,
    layer: "E4",
    mechanism,
    evidenceFamily: "same_origin_tension",
    originClusterKeys: sortedUnique(
      aggregateWitnesses.flatMap((witness) => witness.originPath),
    ),
    involvedObjectKeys: sortedUnique(
      aggregateWitnesses.flatMap((witness) => witness.objectPath),
    ),
    supportRelationKeys: sortedUnique(
      aggregateWitnesses.flatMap((witness) => witness.atomicRelationKeys),
    ),
    counterRelationKeys: sortedUnique(
      aggregateWitnesses.flatMap((witness) => witness.counterRelationKeys),
    ),
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

export function calculateClosureEvidence(
  paths: readonly EvidencePath[],
  closure: RelationClosure,
  E4: Readonly<Record<MechanismId, TensionState>>,
): EvidenceState {
  if (Object.values(closure.diagnostics).some((count) => count !== 0)) {
    return "conflicted";
  }
  if (paths.some((path) => path.state === "conflicted")) return "conflicted";

  const A01 = calculateA01ClosureClaim(paths, E4.A01);
  const otherClaims = (["A02", "A03", "A04"] as const).map(
    (mechanism) => E4[mechanism],
  );
  return aggregateStructuralEvidence([A01, ...otherClaims]);
}

function calculateA01ClosureClaim(
  paths: readonly EvidencePath[],
  witnessState: TensionState,
): TensionState {
  if (witnessState === "not_supported") return "not_supported";
  if (witnessState === "conflicted") return "conflicted";
  const supply = aggregatePathStatus(paths, "input_subject");
  if (witnessState === "established" && supply === "effective") {
    return "established";
  }
  if (
    ["established", "candidate"].includes(witnessState) &&
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
  edge: DecisionPathState,
): DimensionStates["D1"] {
  if (
    availability.input === "unknown" ||
    availability.subject === "unknown" ||
    edge === "unknown" ||
    edge === "conflicted"
  ) {
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
  return "supply_limited";
}

function outputCapacityDimension(
  outputVisible: boolean,
  availability: NodeAvailabilityByRole,
  edge: DecisionPathState,
): DimensionStates["D2"] {
  if (
    availability.output === "unknown" ||
    availability.subject === "unknown" ||
    edge === "unknown" ||
    edge === "conflicted"
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
  outputMediated: DecisionPathState,
  inputMediated: DecisionPathState,
  direct: DecisionPathState,
): DimensionStates["D3"] {
  if (availability.constraint === "absent") return "blocked";
  if (
    availability.constraint === "unknown" ||
    [outputMediated, inputMediated, direct].some((state) =>
      ["unknown", "conflicted"].includes(state),
    )
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
  conversion: DecisionPathState,
): DimensionStates["D4"] {
  const roles: readonly Role[] = ["input", "subject", "output", "resource"];
  if (
    roles.some((role) => availability[role] === "unknown") ||
    conversion === "unknown" ||
    conversion === "conflicted"
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
  subjectOutput: DecisionPathState,
  outputConstraint: DecisionPathState,
  constraintSubject: DecisionPathState,
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
    outputConstraint === "conflicted" ||
    constraintSubject === "conflicted"
  ) {
    return "shared_endpoint_competition";
  }
  if (subjectOutput === "conflicted") return "unresolved";
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
  outputResource: DecisionPathState,
): DimensionStates["D6"] {
  if (
    availability.output === "unknown" ||
    availability.resource === "unknown" ||
    outputResource === "unknown" ||
    outputResource === "conflicted"
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
): DecisionPathState {
  const matches = paths.filter((path) => path.id === id);
  if (matches.length === 0) return "blocked";
  if (matches.length !== 1) {
    throw new Error(`EvidenceGraph has duplicate interface path: ${id}`);
  }
  return interfacePathStateToEffectiveness(matches[0].state);
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

function interfacePathStateToEvidenceState(
  status: InterfacePath["state"],
): EvidenceState {
  if (status === "conflicted") return "conflicted";
  if (status === "effective") return "established";
  if (status === "limited") return "candidate";
  if (status === "absent") return "not_supported";
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

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort(ordinalCompare);
}
