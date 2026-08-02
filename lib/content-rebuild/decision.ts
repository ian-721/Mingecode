import {
  EVIDENCE_FAMILY_ORDER,
  MECHANISMS,
  type BoundaryPair,
  type CandidateEvidenceStates,
  type DimensionEvaluation,
  type DimensionKey,
  type DimensionStates,
  type EvidenceFamily,
  type EvidenceGraph,
  type EvidenceNode,
  type EvidencePathId,
  type EvidenceSourceData,
  type EvidenceState,
  type MechanismEvaluation,
  type MechanismId,
  type NearestNeighborResult,
  type NeighborComparison,
  type TensionState,
} from "./types";
import { aggregatePathStatus } from "./evidence";
import { ordinalCompare } from "./relation-interface";

type BoundarySupport = NeighborComparison["leftSupport"];

interface MechanismDefinition {
  readonly requiredDimensions: readonly [DimensionKey, DimensionKey];
  readonly exact: (dimensions: DimensionStates) => boolean;
  readonly weak: (dimensions: DimensionStates) => boolean;
}

interface BoundaryDefinition {
  readonly pair: BoundaryPair;
  readonly left: MechanismId;
  readonly right: MechanismId;
  readonly leftDimensions: readonly DimensionKey[];
  readonly rightDimensions: readonly DimensionKey[];
  readonly leftPaths: readonly EvidencePathId[];
  readonly rightPaths: readonly EvidencePathId[];
  readonly leftStrong: (
    dimensions: DimensionStates,
    graph: EvidenceGraph,
  ) => boolean;
  readonly rightStrong: (
    dimensions: DimensionStates,
    graph: EvidenceGraph,
  ) => boolean;
  readonly basis: string;
}

interface ExclusionEvaluation {
  readonly hit: boolean;
  readonly sourceDimensions: readonly DimensionKey[];
  readonly counterDimensions: readonly DimensionKey[];
}

interface E5Decision {
  readonly state: EvidenceState;
  readonly coreCandidates: readonly MechanismId[];
  readonly coreMechanism: MechanismId | null;
}

export interface ProvenanceGateResult {
  readonly evidenceFamilies: readonly EvidenceFamily[];
  readonly originClusterKeys: readonly string[];
  readonly failures: readonly string[];
}

export interface CandidateDecision {
  readonly evidence: CandidateEvidenceStates;
  readonly decisionEvidence: readonly EvidenceNode[];
  readonly evidenceFamilies: readonly EvidenceFamily[];
  readonly originClusterKeys: readonly string[];
  readonly tensions: Readonly<Record<MechanismId, TensionState>>;
  readonly tension: TensionState;
  readonly mechanismEvaluations: Readonly<
    Record<MechanismId, MechanismEvaluation>
  >;
  readonly exclusion: boolean;
  readonly nearestNeighbor: NearestNeighborResult;
  readonly coreCandidates: readonly MechanismId[];
  readonly coreMechanism: MechanismId | null;
  readonly candidateState: EvidenceState;
}

const MECHANISM_DEFINITIONS: Readonly<
  Record<MechanismId, MechanismDefinition>
> = {
  A01: {
    requiredDimensions: ["D1", "D6"],
    exact: (dimensions) =>
      dimensions.D1 === "supply_continuous" &&
      ["resource_interface_limited", "resource_interface_blocked"].includes(
        dimensions.D6,
      ),
    weak: (dimensions) =>
      dimensions.D1 === "supply_limited" &&
      ["resource_interface_limited", "resource_interface_blocked"].includes(
        dimensions.D6,
      ),
  },
  A02: {
    requiredDimensions: ["D2", "D5"],
    exact: (dimensions) =>
      dimensions.D2 === "output_visible_asymmetric" &&
      dimensions.D5 === "output_constraint_regulating",
    weak: (dimensions) =>
      dimensions.D2 === "output_limited" && dimensions.D5 === "unresolved",
  },
  A03: {
    requiredDimensions: ["D3", "D2"],
    exact: (dimensions) =>
      dimensions.D3 === "constraint_mediated_by_output" &&
      dimensions.D2 === "output_supported",
    weak: (dimensions) =>
      dimensions.D3 === "unresolved" &&
      ["output_supported", "output_limited"].includes(dimensions.D2),
  },
  A04: {
    requiredDimensions: ["D4", "D6"],
    exact: (dimensions) =>
      dimensions.D4 === "conversion_continuous" &&
      dimensions.D6 === "resource_interface_effective",
    weak: (dimensions) =>
      dimensions.D4 === "conversion_limited" &&
      dimensions.D6 === "resource_interface_limited",
  },
};

const BOUNDARIES: readonly BoundaryDefinition[] = [
  {
    pair: "A01_A04",
    left: "A01",
    right: "A04",
    leftDimensions: ["D1", "D6"],
    rightDimensions: ["D4", "D6"],
    leftPaths: ["input_subject", "subject_output", "output_resource"],
    rightPaths: ["conversion", "output_resource"],
    leftStrong: (dimensions, graph) =>
      dimensions.D1 === "supply_continuous" &&
      ["resource_interface_limited", "resource_interface_blocked"].includes(
        dimensions.D6,
      ) &&
      pathHasStatus(graph, "input_subject", "effective") &&
      pathHasStatus(graph, "subject_output", "effective") &&
      pathHasStatus(graph, "output_resource", "limited", "blocked"),
    rightStrong: (dimensions, graph) =>
      dimensions.D4 === "conversion_continuous" &&
      dimensions.D6 === "resource_interface_effective" &&
      pathHasStatus(graph, "conversion", "effective") &&
      pathHasStatus(graph, "output_resource", "effective"),
    basis: "D6 limited/blocked versus D4 continuous with D6 effective",
  },
  {
    pair: "A02_A04",
    left: "A02",
    right: "A04",
    leftDimensions: ["D2", "D5"],
    rightDimensions: ["D4", "D6"],
    leftPaths: ["subject_output", "output_constraint", "constraint_subject"],
    rightPaths: ["conversion", "output_resource"],
    leftStrong: (dimensions, graph) =>
      dimensions.D2 === "output_visible_asymmetric" &&
      dimensions.D5 === "output_constraint_regulating" &&
      pathHasStatus(graph, "subject_output", "limited") &&
      pathHasStatus(graph, "output_constraint", "effective") &&
      pathHasStatus(graph, "constraint_subject", "limited"),
    rightStrong: (dimensions, graph) =>
      dimensions.D4 === "conversion_continuous" &&
      dimensions.D6 === "resource_interface_effective" &&
      pathHasStatus(graph, "conversion", "effective"),
    basis: "D2 asymmetric plus regulating triangle versus full conversion",
  },
  {
    pair: "A03_A04",
    left: "A03",
    right: "A04",
    leftDimensions: ["D3", "D2", "D5"],
    rightDimensions: ["D4", "D6"],
    leftPaths: ["output_mediated", "constraint_subject"],
    rightPaths: ["conversion", "output_resource"],
    leftStrong: (dimensions, graph) =>
      dimensions.D3 === "constraint_mediated_by_output" &&
      dimensions.D2 === "output_supported" &&
      pathHasStatus(graph, "output_mediated", "effective") &&
      pathHasStatus(graph, "constraint_subject", "effective"),
    rightStrong: (dimensions, graph) =>
      dimensions.D4 === "conversion_continuous" &&
      dimensions.D6 === "resource_interface_effective" &&
      pathHasStatus(graph, "conversion", "effective"),
    basis: "output-mediated feedback versus full resource conversion",
  },
  {
    pair: "A01_A03",
    left: "A01",
    right: "A03",
    leftDimensions: ["D1", "D2", "D3", "D6"],
    rightDimensions: ["D3", "D2", "D5"],
    leftPaths: [
      "input_subject",
      "subject_output",
      "output_resource",
      "output_mediated",
      "input_mediated",
    ],
    rightPaths: ["output_mediated", "constraint_subject"],
    leftStrong: (dimensions, graph) =>
      dimensions.D1 === "supply_continuous" &&
      dimensions.D2 === "output_supported" &&
      ["blocked", "direct_only"].includes(dimensions.D3) &&
      ["resource_interface_limited", "resource_interface_blocked"].includes(
        dimensions.D6,
      ) &&
      pathHasStatus(graph, "output_mediated", "blocked") &&
      pathHasStatus(graph, "input_mediated", "blocked"),
    rightStrong: (dimensions, graph) =>
      dimensions.D3 === "constraint_mediated_by_output" &&
      dimensions.D2 === "output_supported" &&
      dimensions.D5 === "output_constraint_feedback" &&
      pathHasStatus(graph, "output_mediated", "effective") &&
      pathHasStatus(graph, "constraint_subject", "effective"),
    basis: "continuous supply without mediation versus output-mediated feedback",
  },
  {
    pair: "A02_A03",
    left: "A02",
    right: "A03",
    leftDimensions: ["D2", "D5"],
    rightDimensions: ["D3", "D2", "D5"],
    leftPaths: ["subject_output", "output_constraint", "constraint_subject"],
    rightPaths: ["output_mediated", "constraint_subject"],
    leftStrong: (dimensions, graph) =>
      dimensions.D2 === "output_visible_asymmetric" &&
      dimensions.D5 === "output_constraint_regulating" &&
      pathHasStatus(graph, "subject_output", "limited") &&
      pathHasStatus(graph, "output_constraint", "effective") &&
      pathHasStatus(graph, "constraint_subject", "limited"),
    rightStrong: (dimensions, graph) =>
      dimensions.D3 === "constraint_mediated_by_output" &&
      dimensions.D2 === "output_supported" &&
      dimensions.D5 === "output_constraint_feedback" &&
      pathHasStatus(graph, "subject_output", "effective") &&
      pathHasStatus(graph, "output_constraint", "effective") &&
      pathHasStatus(graph, "constraint_subject", "effective"),
    basis: "limited/effective/limited regulation versus all-effective feedback",
  },
  {
    pair: "A01_A02",
    left: "A01",
    right: "A02",
    leftDimensions: ["D1", "D2", "D6"],
    rightDimensions: ["D2", "D5"],
    leftPaths: ["input_subject", "subject_output", "output_resource"],
    rightPaths: ["subject_output", "output_constraint", "constraint_subject"],
    leftStrong: (dimensions, graph) =>
      dimensions.D1 === "supply_continuous" &&
      dimensions.D2 === "output_supported" &&
      ["resource_interface_limited", "resource_interface_blocked"].includes(
        dimensions.D6,
      ) &&
      pathHasStatus(graph, "input_subject", "effective") &&
      pathHasStatus(graph, "subject_output", "effective"),
    rightStrong: (dimensions, graph) =>
      dimensions.D2 === "output_visible_asymmetric" &&
      dimensions.D5 === "output_constraint_regulating" &&
      pathHasStatus(graph, "subject_output", "limited") &&
      pathHasStatus(graph, "output_constraint", "effective") &&
      pathHasStatus(graph, "constraint_subject", "limited"),
    basis: "continuous non-asymmetric supply versus asymmetric regulation",
  },
] as const;

export function evaluateCandidateDecision(
  graph: EvidenceGraph,
  dimensionEvaluation: DimensionEvaluation,
): CandidateDecision {
  const dimensions = dimensionEvaluation.states;
  const tensions = readTensions(graph, dimensions);
  const exclusionEvaluations = Object.fromEntries(
    MECHANISMS.map((mechanism) => [
      mechanism,
      evaluateExclusion(mechanism, dimensions),
    ]),
  ) as unknown as Readonly<Record<MechanismId, ExclusionEvaluation>>;
  const exclusions = Object.fromEntries(
    MECHANISMS.map((mechanism) => [
      mechanism,
      exclusionEvaluations[mechanism].hit,
    ]),
  ) as unknown as Readonly<Record<MechanismId, boolean>>;
  const mechanismEvaluations = Object.fromEntries(
    MECHANISMS.map((mechanism) => [
      mechanism,
      evaluateMechanism(
        mechanism,
        graph,
        dimensionEvaluation,
        exclusions[mechanism],
      ),
    ]),
  ) as unknown as Readonly<Record<MechanismId, MechanismEvaluation>>;
  const nearestNeighbor = evaluatePairBoundaries(
    graph,
    dimensions,
    exclusions,
  );
  const exclusionNodes = buildExclusionNodes(
    graph,
    dimensionEvaluation,
    exclusionEvaluations,
  );
  const boundaryNodes = buildBoundaryNodes(
    graph,
    dimensionEvaluation,
    nearestNeighbor,
  );
  const decisionEvidence = [...exclusionNodes, ...boundaryNodes];
  const E5 = deriveE5Decision(
    exclusionNodes,
    nearestNeighbor,
    mechanismEvaluations,
  );
  // EvidenceGraph.layers.E4 remains the pre-dimension, mechanism-specific raw
  // witness aggregate. This output summary qualifies every mechanism
  // symmetrically after D1-D6, before E5; it never mutates or feeds the graph.
  const evidence: CandidateEvidenceStates = {
    ...graph.layers,
    E4: aggregateTensions(Object.values(tensions)),
    E5: E5.state,
  };
  const relevantMechanisms = MECHANISMS.filter((mechanism) => {
    const e4Node = graph.nodes.find(
      (node) => node.id === graph.e4NodeIds[mechanism],
    );
    return (
      e4Node !== undefined &&
      e4Node.supportRelationKeys.length > 0 &&
      (MECHANISM_DEFINITIONS[mechanism].exact(dimensions) ||
        MECHANISM_DEFINITIONS[mechanism].weak(dimensions) ||
        exclusionEvaluations[mechanism].hit ||
        e4Node.status === "conflicted")
    );
  });
  const actualSources: EvidenceSourceData[] = [
    ...resolveSources(
      graph,
      sortedUnique(
        relevantMechanisms.flatMap(
          (mechanism) =>
            mechanismEvaluations[mechanism].supportEvidenceIds,
        ),
      ),
    ),
    ...exclusionNodes,
  ];
  const provenance = collectActualProvenance(actualSources);

  return {
    evidence,
    decisionEvidence,
    evidenceFamilies: provenance.evidenceFamilies,
    originClusterKeys: provenance.originClusterKeys,
    tensions,
    tension: aggregateTensions(Object.values(tensions)),
    mechanismEvaluations,
    exclusion: exclusionNodes.length > 0,
    nearestNeighbor,
    coreCandidates: E5.coreCandidates,
    coreMechanism: E5.coreMechanism,
    candidateState: evidence.E5,
  };
}

function deriveE5Decision(
  exclusionNodes: readonly EvidenceNode[],
  nearestNeighbor: NearestNeighborResult,
  evaluations: Readonly<Record<MechanismId, MechanismEvaluation>>,
): E5Decision {
  if (exclusionNodes.length > 0) {
    return { state: "conflicted", coreCandidates: [], coreMechanism: null };
  }
  const supportedPassing = nearestNeighbor.passingMechanisms.filter(
    (mechanism) =>
      evaluations[mechanism].supportState !== "not_supported" &&
      !evaluations[mechanism].excluded,
  );
  if (
    nearestNeighbor.status === "unique" &&
    supportedPassing.length === 1 &&
    evaluations[supportedPassing[0]].supportState === "established"
  ) {
    return {
      state: "established",
      coreCandidates: supportedPassing,
      coreMechanism: supportedPassing[0],
    };
  }
  if (supportedPassing.length > 0) {
    return {
      state: "candidate",
      coreCandidates: supportedPassing,
      coreMechanism: null,
    };
  }
  return { state: "not_supported", coreCandidates: [], coreMechanism: null };
}

function evaluateMechanism(
  mechanism: MechanismId,
  graph: EvidenceGraph,
  dimensionEvaluation: DimensionEvaluation,
  excluded: boolean,
): MechanismEvaluation {
  const definition = MECHANISM_DEFINITIONS[mechanism];
  const e4Node = graph.nodes.find(
    (node) => node.id === graph.e4NodeIds[mechanism],
  );
  if (!e4Node || e4Node.layer !== "E4") {
    throw new Error(`EvidenceGraph is missing E4 node: ${mechanism}`);
  }
  const supportEvidenceIds = sortedUnique([
    ...definition.requiredDimensions.flatMap(
      (dimension) => dimensionEvaluation.supportingEvidenceIds[dimension],
    ),
    ...(e4Node.supportRelationKeys.length > 0 ? [e4Node.id] : []),
  ]);
  const sources = resolveSources(graph, supportEvidenceIds);
  const provenance = evaluateProvenanceGate(
    sources,
    definition.requiredDimensions,
  );
  const gateFailures = [...provenance.failures];
  const exact = definition.exact(dimensionEvaluation.states);
  const weak = definition.weak(dimensionEvaluation.states);

  if (!exact) gateFailures.push("required_dimensions_not_established");
  if (e4Node.status !== "established") {
    gateFailures.push("e4_not_established");
  }
  if (excluded) gateFailures.push("structural_exclusion");

  let supportState: MechanismEvaluation["supportState"] = "not_supported";
  if (
    exact &&
    e4Node.status === "established" &&
    provenance.failures.length === 0 &&
    !excluded
  ) {
    supportState = "established";
  } else if (
    weak &&
    ["established", "candidate"].includes(e4Node.status) &&
    provenance.failures.length === 0 &&
    !excluded
  ) {
    supportState = "candidate";
  }

  return {
    supportState,
    excluded,
    requiredDimensions: definition.requiredDimensions,
    supportEvidenceIds,
    evidenceFamilies: provenance.evidenceFamilies,
    originClusterKeys: provenance.originClusterKeys,
    gateFailures: sortedUnique(gateFailures),
  };
}

export function evaluateProvenanceGate(
  sources: readonly EvidenceSourceData[],
  distinctDimensions: readonly DimensionKey[],
): ProvenanceGateResult {
  const supportingSources = sources.filter(
    (source) =>
      ["established", "candidate"].includes(source.status) &&
      hasConcreteProvenance(source),
  );
  const provenance = collectActualProvenance(supportingSources);
  const { evidenceFamilies, originClusterKeys } = provenance;
  const failures: string[] = [];
  if (new Set(distinctDimensions).size < 2) {
    failures.push("fewer_than_two_distinct_dimensions");
  }
  if (evidenceFamilies.length < 2) {
    failures.push("fewer_than_two_evidence_families");
  }
  if (originClusterKeys.length < 2) {
    failures.push("fewer_than_two_origin_clusters");
  }
  return { evidenceFamilies, originClusterKeys, failures };
}

function collectActualProvenance(
  sources: readonly EvidenceSourceData[],
): Pick<ProvenanceGateResult, "evidenceFamilies" | "originClusterKeys"> {
  const actualSources = sources.filter(hasConcreteProvenance);
  return {
    evidenceFamilies: EVIDENCE_FAMILY_ORDER.filter((family) =>
      actualSources.some((source) => source.evidenceFamily === family),
    ),
    originClusterKeys: sortedUnique(
      actualSources.flatMap((source) => source.originClusterKeys),
    ),
  };
}

function hasConcreteProvenance(source: EvidenceSourceData): boolean {
  return (
    source.originClusterKeys.length > 0 ||
    source.involvedObjectKeys.length > 0 ||
    source.supportRelationKeys.length > 0 ||
    source.counterRelationKeys.length > 0
  );
}

export function evaluatePairBoundaries(
  graph: EvidenceGraph,
  dimensions: DimensionStates,
  exclusions: Readonly<Record<MechanismId, boolean>>,
): NearestNeighborResult {
  const genericSupport = Object.fromEntries(
    MECHANISMS.map((mechanism) => [
      mechanism,
      mechanismBoundarySupport(mechanism, graph, dimensions, exclusions),
    ]),
  ) as unknown as Readonly<Record<MechanismId, BoundarySupport>>;
  const comparisons = BOUNDARIES.map((boundary): NeighborComparison => {
    const leftSupport = boundarySupportForSide(
      boundary.left,
      boundary.leftStrong(dimensions, graph),
      genericSupport,
    );
    const rightSupport = boundarySupportForSide(
      boundary.right,
      boundary.rightStrong(dimensions, graph),
      genericSupport,
    );
    return {
      pair: boundary.pair,
      left: boundary.left,
      right: boundary.right,
      leftMatched: leftSupport === "strong",
      rightMatched: rightSupport === "strong",
      leftSupport,
      rightSupport,
      result: compareBoundarySupport(leftSupport, rightSupport),
      basis: boundary.basis,
    };
  });

  const eligible = MECHANISMS.filter(
    (mechanism) =>
      genericSupport[mechanism] === "strong" ||
      genericSupport[mechanism] === "weak",
  );
  const eliminated = new Set<MechanismId>();
  for (const comparison of comparisons) {
    if (comparison.result === "left") eliminated.add(comparison.right);
    if (comparison.result === "right") eliminated.add(comparison.left);
  }
  const passingMechanisms = eligible.filter(
    (mechanism) => !eliminated.has(mechanism),
  );
  const candidateMechanisms = eligible.filter(
    (mechanism) => genericSupport[mechanism] === "weak",
  );

  return {
    comparisons,
    passingMechanisms,
    candidateMechanisms,
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

function boundarySupportForSide(
  mechanism: MechanismId,
  strongPredicate: boolean,
  genericSupport: Readonly<Record<MechanismId, BoundarySupport>>,
): BoundarySupport {
  const generic = genericSupport[mechanism];
  if (generic === "conflicted" || generic === "none") return generic;
  return strongPredicate && generic === "strong" ? "strong" : "weak";
}

function mechanismBoundarySupport(
  mechanism: MechanismId,
  graph: EvidenceGraph,
  dimensions: DimensionStates,
  exclusions: Readonly<Record<MechanismId, boolean>>,
): BoundarySupport {
  const definition = MECHANISM_DEFINITIONS[mechanism];
  const e4Node = graph.nodes.find(
    (node) => node.id === graph.e4NodeIds[mechanism],
  );
  if (!e4Node) throw new Error(`EvidenceGraph is missing E4 node: ${mechanism}`);
  const hasSupport =
    (definition.exact(dimensions) && e4Node.status === "established") ||
    (definition.weak(dimensions) &&
      ["established", "candidate"].includes(e4Node.status));
  if (exclusions[mechanism] && (hasSupport || e4Node.status === "conflicted")) {
    return "conflicted";
  }
  if (definition.exact(dimensions) && e4Node.status === "established") {
    return "strong";
  }
  if (
    definition.weak(dimensions) &&
    ["established", "candidate"].includes(e4Node.status)
  ) {
    return "weak";
  }
  return "none";
}

function compareBoundarySupport(
  left: BoundarySupport,
  right: BoundarySupport,
): NeighborComparison["result"] {
  const leftUsable = left === "strong" || left === "weak";
  const rightUsable = right === "strong" || right === "weak";
  if (!leftUsable && !rightUsable) return "not_applicable";
  if (left === "strong" && right !== "strong") return "left";
  if (right === "strong" && left !== "strong") return "right";
  return "unresolved";
}

function pathHasStatus(
  graph: EvidenceGraph,
  pathId: EvidencePathId,
  ...allowed: readonly ("effective" | "limited" | "blocked" | "unknown")[]
): boolean {
  const state = aggregatePathStatus(graph.paths, pathId);
  return state !== "conflicted" && allowed.includes(state);
}

function evaluateExclusion(
  mechanism: MechanismId,
  dimensions: DimensionStates,
): ExclusionEvaluation {
  if (mechanism === "A01") {
    const hit =
      dimensions.D1 === "supply_continuous" &&
      ["resource_interface_limited", "resource_interface_blocked"].includes(
        dimensions.D6,
      ) &&
      [
        "constraint_mediated_by_output",
        "constraint_mediated_by_input",
        "mixed",
      ].includes(dimensions.D3)
    return {
      hit,
      sourceDimensions: ["D1", "D6", "D3"],
      counterDimensions: ["D3"],
    };
  }
  if (mechanism === "A02") {
    const D5Counter = [
      "shared_endpoint_competition",
      "output_constraint_feedback",
    ].includes(dimensions.D5);
    const D4Counter = dimensions.D4 === "conversion_continuous";
    return {
      hit:
      dimensions.D2 === "output_visible_asymmetric" &&
        (D5Counter || D4Counter),
      sourceDimensions: [
        "D2",
        ...(D5Counter ? (["D5"] as const) : []),
        ...(D4Counter ? (["D4"] as const) : []),
      ],
      counterDimensions: [
        ...(D5Counter ? (["D5"] as const) : []),
        ...(D4Counter ? (["D4"] as const) : []),
      ],
    };
  }
  if (mechanism === "A03") {
    const D3Counter = [
      "mixed",
      "constraint_mediated_by_input",
      "direct_only",
      "blocked",
    ].includes(dimensions.D3);
    return {
      hit:
      dimensions.D2 === "output_supported" &&
      dimensions.D5 === "output_constraint_feedback" &&
        D3Counter,
      sourceDimensions: ["D2", "D5", "D3"],
      counterDimensions: ["D3"],
    };
  }
  const D3Counter = ["constraint_mediated_by_output", "mixed"].includes(
    dimensions.D3,
  );
  const D6Counter = [
    "resource_interface_limited",
    "resource_interface_blocked",
  ].includes(dimensions.D6);
  return {
    hit:
    dimensions.D4 === "conversion_continuous" &&
      (D3Counter || D6Counter),
    sourceDimensions: [
      "D4",
      ...(D3Counter ? (["D3"] as const) : []),
      ...(D6Counter ? (["D6"] as const) : []),
    ],
    counterDimensions: [
      ...(D3Counter ? (["D3"] as const) : []),
      ...(D6Counter ? (["D6"] as const) : []),
    ],
  };
}

function buildExclusionNodes(
  graph: EvidenceGraph,
  dimensionEvaluation: DimensionEvaluation,
  exclusions: Readonly<Record<MechanismId, ExclusionEvaluation>>,
): EvidenceNode[] {
  return MECHANISMS.filter((mechanism) => exclusions[mechanism].hit).map(
    (mechanism) => {
      const evaluation = exclusions[mechanism];
      const sourceIds = evaluation.sourceDimensions.flatMap(
        (dimension) => dimensionEvaluation.supportingEvidenceIds[dimension],
      );
      const counterIds = evaluation.counterDimensions.flatMap(
        (dimension) => dimensionEvaluation.supportingEvidenceIds[dimension],
      );
      const sources = resolveSources(graph, sourceIds);
      const counterSources = resolveSources(graph, counterIds);
      return {
        id: `e5:exclusion:${mechanism}`,
        layer: "E5",
        mechanism,
        evidenceFamily: "exclusion_boundary",
        originClusterKeys: sortedUnique(
          sources.flatMap((source) => source.originClusterKeys),
        ),
        involvedObjectKeys: sortedUnique(
          sources.flatMap((source) => source.involvedObjectKeys),
        ),
        supportRelationKeys: sortedUnique(
          sources.flatMap((source) => source.supportRelationKeys),
        ),
        counterRelationKeys: sortedUnique(
          counterSources.flatMap((source) => [
            ...source.counterRelationKeys,
            ...source.supportRelationKeys,
          ]),
        ),
        status: "conflicted",
        structuralStatus: "limited",
        visible: null,
      };
    },
  );
}

function buildBoundaryNodes(
  graph: EvidenceGraph,
  dimensionEvaluation: DimensionEvaluation,
  nearestNeighbor: NearestNeighborResult,
): EvidenceNode[] {
  return nearestNeighbor.comparisons.map((comparison) => {
    const definition = BOUNDARIES.find(
      (boundary) => boundary.pair === comparison.pair,
    );
    if (!definition) throw new Error(`Missing boundary: ${comparison.pair}`);
    const mechanism =
      comparison.result === "left"
        ? comparison.left
        : comparison.result === "right"
          ? comparison.right
          : null;
    const dimensionIds = [
      ...definition.leftDimensions,
      ...definition.rightDimensions,
    ].flatMap(
      (dimension) => dimensionEvaluation.supportingEvidenceIds[dimension],
    );
    const pathIds = [...definition.leftPaths, ...definition.rightPaths];
    const sourceIds = sortedUnique([
      ...dimensionIds,
      ...graph.paths
        .filter((path) => pathIds.includes(path.id))
        .map((path) => path.key),
      graph.e4NodeIds[comparison.left],
      graph.e4NodeIds[comparison.right],
    ]);
    const sources = resolveSources(graph, sourceIds).filter(
      hasConcreteProvenance,
    );
    return {
      id: `e5:boundary:${comparison.pair}`,
      layer: "E5",
      mechanism,
      evidenceFamily: "exclusion_boundary",
      originClusterKeys: sortedUnique(
        sources.flatMap((source) => source.originClusterKeys),
      ),
      involvedObjectKeys: sortedUnique(
        sources.flatMap((source) => source.involvedObjectKeys),
      ),
      supportRelationKeys: sortedUnique(
        sources.flatMap((source) => source.supportRelationKeys),
      ),
      counterRelationKeys: sortedUnique(
        sources.flatMap((source) => source.counterRelationKeys),
      ),
      status:
        comparison.result === "unresolved"
          ? "candidate"
          : comparison.result === "not_applicable"
            ? "not_supported"
            : "established",
      structuralStatus:
        comparison.result === "unresolved"
          ? "limited"
          : comparison.result === "not_applicable"
            ? "blocked"
            : "effective",
      visible: null,
    };
  });
}

function readTensions(
  graph: EvidenceGraph,
  dimensions: DimensionStates,
): Readonly<Record<MechanismId, TensionState>> {
  return Object.fromEntries(
    MECHANISMS.map((mechanism) => {
      const node = graph.nodes.find(
        (item) => item.id === graph.e4NodeIds[mechanism],
      );
      if (!node || node.layer !== "E4") {
        throw new Error(`EvidenceGraph is missing E4 node: ${mechanism}`);
      }
      if (node.status === "boundary_sensitive") {
        throw new Error("Candidate-local E4 cannot be boundary_sensitive");
      }
      const definition = MECHANISM_DEFINITIONS[mechanism];
      const status =
        definition.weak(dimensions) &&
        ["established", "candidate"].includes(node.status)
          ? "candidate"
          : node.status;
      return [mechanism, status];
    }),
  ) as unknown as Readonly<Record<MechanismId, TensionState>>;
}

function resolveSources(
  graph: EvidenceGraph,
  ids: readonly string[],
): EvidenceSourceData[] {
  return ids.map((id) => {
    const source =
      graph.nodes.find((node) => node.id === id) ??
      graph.paths.find((path) => path.key === id);
    if (!source) throw new Error(`EvidenceGraph is missing source: ${id}`);
    return source;
  });
}

function aggregateTensions(states: readonly TensionState[]): TensionState {
  if (states.includes("conflicted")) return "conflicted";
  if (states.includes("established")) return "established";
  if (states.includes("candidate")) return "candidate";
  return "not_supported";
}

function sortedUnique<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort(ordinalCompare);
}
