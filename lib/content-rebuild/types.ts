export const ROLES = [
  "subject",
  "input",
  "peer",
  "output",
  "resource",
  "constraint",
] as const;

export const MECHANISMS = ["A01", "A02", "A03", "A04"] as const;

export const EVIDENCE_FAMILY_ORDER = [
  "node_availability",
  "complete_relation_closure",
  "branch_contact",
  "same_origin_tension",
  "exclusion_boundary",
  "candidate_stability",
] as const;

export type Role = (typeof ROLES)[number];
export type MechanismId = (typeof MECHANISMS)[number];
export type EvidenceFamily = (typeof EVIDENCE_FAMILY_ORDER)[number];
export type Precision = "exact" | "bounded";
export type SeasonalStrength = "旺" | "相" | "休" | "囚" | "死" | "unknown";
export type OccurrenceKind = "day_anchor" | "visible" | "hidden";
export type NodeAvailability = "usable" | "limited" | "absent" | "unknown";
export type RelationKind = "generates" | "controls" | "same_role";
export type RelationDirection = "forward" | "undirected";
export type RelationEffectiveness =
  | "effective"
  | "limited"
  | "blocked"
  | "unknown";
export type EvidenceState =
  | "established"
  | "candidate"
  | "conflicted"
  | "not_supported"
  | "boundary_sensitive";
export type FinalState = EvidenceState;
export type TensionState =
  | "established"
  | "candidate"
  | "conflicted"
  | "not_supported";
export type CandidateEvidenceKey = "E1" | "E2" | "E3" | "E4" | "E5";
export type EvidenceKey = CandidateEvidenceKey | "E6";
export type DimensionKey = "D1" | "D2" | "D3" | "D4" | "D5" | "D6";

export interface Occurrence {
  readonly role: Role;
  readonly kind: OccurrenceKind;
  readonly objectKey: string;
  readonly originClusterKey: string;
  readonly hiddenStemProportion: number | null;
  readonly rootOccurrence: boolean;
}

export interface ChartFacts {
  readonly precision: Precision;
  readonly missingPositions: readonly string[];
  readonly seasonalStrength: Readonly<Record<Role, SeasonalStrength>>;
  readonly occurrences: readonly Occurrence[];
  readonly branchContactFacts?: readonly never[];
}

export interface ChartCandidate {
  readonly candidateId: string;
  readonly facts: ChartFacts;
}

export interface ManifestationAnswer {
  readonly questionId: string;
  readonly answer: string;
}

export interface StaticRuleEngineInput {
  readonly timeBasisVersion: "civil_time_v1";
  readonly candidates: readonly ChartCandidate[];
  readonly manifestationAnswers?: readonly ManifestationAnswer[];
}

export type NodeAvailabilityByRole = Readonly<Record<Role, NodeAvailability>>;

export interface NormalizedRelation {
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
  readonly effectiveness: RelationEffectiveness;
  readonly competesForInterface: boolean;
  readonly limitedByCompetition: boolean;
}

export interface ClosureDiagnostics {
  readonly invalidRoleRelationCount: number;
  readonly missingDeterministicRelationCount: number;
  readonly duplicateRelationAfterSourceDedupeCount: number;
  readonly unexpectedManuallySelectedRelationCount: number;
}

export interface RelationClosure {
  readonly expectedRelationCount: number;
  readonly rawRelationCount: number;
  readonly relations: readonly NormalizedRelation[];
  readonly sourceDedupedRelations: readonly NormalizedRelation[];
  readonly relationEffectivenessCounts: Readonly<
    Record<RelationEffectiveness, number>
  >;
  readonly diagnostics: ClosureDiagnostics;
}

export interface EvidenceSourceData {
  readonly evidenceFamily: EvidenceFamily;
  readonly originClusterKeys: readonly string[];
  readonly involvedObjectKeys: readonly string[];
  readonly supportRelationKeys: readonly string[];
  readonly counterRelationKeys: readonly string[];
  readonly status: EvidenceState;
}

export interface EvidenceNode extends EvidenceSourceData {
  readonly id: string;
  readonly layer: "E1" | "E2" | "E3" | "E4" | "E5";
  readonly mechanism: MechanismId | null;
  readonly structuralStatus: RelationEffectiveness | null;
  readonly visible: boolean | null;
}

export type EvidencePathId =
  | "input_subject"
  | "subject_output"
  | "output_resource"
  | "output_constraint"
  | "constraint_subject"
  | "constraint_input"
  | "output_mediated"
  | "input_mediated"
  | "conversion";

export interface EvidencePath extends EvidenceSourceData {
  readonly key: string;
  readonly id: EvidencePathId;
  readonly status: EvidenceState;
  readonly structuralStatus: RelationEffectiveness;
  readonly roleSequence: readonly Role[];
  readonly objectPath: readonly string[];
  readonly originPath: readonly string[];
  readonly competesForInterface: boolean;
  readonly limitedByCompetition: boolean;
}

export interface EvidenceGraph {
  readonly nodes: readonly EvidenceNode[];
  readonly paths: readonly EvidencePath[];
  readonly layers: Readonly<Record<"E1" | "E2" | "E3" | "E4", EvidenceState>>;
  readonly roleNodeIds: Readonly<Record<Role, string>>;
  readonly e4NodeIds: Readonly<Record<MechanismId, string>>;
}

export interface DimensionStates {
  readonly D1:
    | "supply_continuous"
    | "supply_limited"
    | "supply_blocked"
    | "unresolved";
  readonly D2:
    | "output_visible_asymmetric"
    | "output_supported"
    | "output_limited"
    | "unresolved";
  readonly D3:
    | "constraint_mediated_by_output"
    | "constraint_mediated_by_input"
    | "direct_only"
    | "mixed"
    | "blocked"
    | "unresolved";
  readonly D4:
    | "conversion_continuous"
    | "conversion_limited"
    | "conversion_blocked"
    | "unresolved";
  readonly D5:
    | "output_constraint_regulating"
    | "output_constraint_feedback"
    | "shared_endpoint_competition"
    | "uncoupled"
    | "unresolved";
  readonly D6:
    | "resource_interface_effective"
    | "resource_interface_limited"
    | "resource_interface_blocked"
    | "unresolved";
}

export interface DimensionEvaluation {
  readonly states: DimensionStates;
  readonly supportingEvidenceIds: Readonly<
    Record<DimensionKey, readonly string[]>
  >;
}

export type CandidateEvidenceStates = Readonly<
  Record<CandidateEvidenceKey, EvidenceState>
>;

export type EvidenceStates = Readonly<Record<EvidenceKey, EvidenceState>>;

export interface MechanismEvaluation {
  readonly supportState: "established" | "candidate" | "not_supported";
  readonly excluded: boolean;
  readonly requiredDimensions: readonly DimensionKey[];
  readonly supportEvidenceIds: readonly string[];
  readonly evidenceFamilies: readonly EvidenceFamily[];
  readonly originClusterKeys: readonly string[];
  readonly gateFailures: readonly string[];
}

export type BoundaryPair =
  | "A01_A04"
  | "A02_A04"
  | "A03_A04"
  | "A01_A03"
  | "A02_A03"
  | "A01_A02";

export interface NeighborComparison {
  readonly pair: BoundaryPair;
  readonly left: MechanismId;
  readonly right: MechanismId;
  readonly leftMatched: boolean;
  readonly rightMatched: boolean;
  readonly leftSupport: "strong" | "weak" | "none" | "conflicted";
  readonly rightSupport: "strong" | "weak" | "none" | "conflicted";
  readonly result: "left" | "right" | "unresolved" | "not_applicable";
  readonly basis: string;
}

export interface NearestNeighborResult {
  readonly comparisons: readonly NeighborComparison[];
  readonly passingMechanisms: readonly MechanismId[];
  readonly candidateMechanisms: readonly MechanismId[];
  readonly status: "unique" | "ambiguous" | "none";
  readonly uniqueMechanism: MechanismId | null;
}

export interface CandidateEvaluation {
  readonly candidateId: string;
  readonly nodeAvailability: NodeAvailabilityByRole;
  readonly closure: RelationClosure;
  readonly evidenceGraph: EvidenceGraph;
  readonly evidence: CandidateEvidenceStates;
  readonly dimensions: DimensionStates;
  readonly dimensionEvidence: Readonly<Record<DimensionKey, readonly string[]>>;
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

export interface StaticRuleEngineResult {
  readonly timeBasisVersion: "civil_time_v1";
  readonly candidateResults: readonly CandidateEvaluation[];
  readonly nodeAvailability: NodeAvailabilityByRole;
  readonly evidence: EvidenceStates;
  readonly candidateStabilityEvidence: EvidenceSourceData;
  readonly dimensions: DimensionStates;
  readonly coreCandidates: readonly MechanismId[];
  readonly coreMechanism: MechanismId | null;
  readonly finalState: FinalState;
  readonly manifestationVariant: "unselected" | "selected" | "reverse";
}
