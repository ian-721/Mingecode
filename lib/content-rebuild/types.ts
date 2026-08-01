export const ROLES = [
  "subject",
  "input",
  "peer",
  "output",
  "resource",
  "constraint",
] as const;

export type Role = (typeof ROLES)[number];
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
export type MechanismId = "A01" | "A02" | "A03" | "A04";
export type FinalState = EvidenceState;
export type TensionState =
  | "established"
  | "candidate"
  | "conflicted"
  | "not_supported";

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
  readonly direction: RelationDirection;
  readonly canonicalRelationKey: string;
  readonly originClusterKeys: readonly string[];
  readonly sourceDedupeKey: string;
  readonly effectiveness: RelationEffectiveness;
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

export type EvidenceStates = Readonly<
  Record<"E1" | "E2" | "E3" | "E4" | "E5" | "E6", EvidenceState>
>;

export interface MechanismEvaluation {
  readonly state: "established" | "candidate" | "not_supported";
  readonly excluded: boolean;
}

export interface NeighborComparison {
  readonly pair: string;
  readonly result: "left" | "right" | "unresolved" | "not_applicable";
}

export interface NearestNeighborResult {
  readonly comparisons: readonly NeighborComparison[];
  readonly passingMechanisms: readonly MechanismId[];
  readonly status: "unique" | "ambiguous" | "none";
  readonly uniqueMechanism: MechanismId | null;
}

export interface CandidateEvaluation {
  readonly candidateId: string;
  readonly nodeAvailability: NodeAvailabilityByRole;
  readonly closure: RelationClosure;
  readonly evidence: EvidenceStates;
  readonly dimensions: DimensionStates;
  readonly evidenceFamilies: readonly string[];
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
  readonly finalState: FinalState;
}

export interface StaticRuleEngineResult {
  readonly timeBasisVersion: "civil_time_v1";
  readonly candidateResults: readonly CandidateEvaluation[];
  readonly nodeAvailability: NodeAvailabilityByRole;
  readonly evidence: EvidenceStates;
  readonly dimensions: DimensionStates;
  readonly coreCandidates: readonly MechanismId[];
  readonly coreMechanism: MechanismId | null;
  readonly finalState: FinalState;
  readonly manifestationVariant: "unselected" | "selected" | "reverse";
}
