import type {
  Branch,
  FourPillars,
  Stem,
  TenRelation,
} from "@4n6h4x0r/stem-branch";

export type TimePrecision = "exact" | "approximate" | "unknown";

export type BirthInput = {
  date: string;
  time: string | null;
  timePrecision: TimePrecision;
  cityId: string;
};

export type CityOption = {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  timezoneId: string;
  aliases: string[];
};

export type TimeStability =
  | "stable"
  | "boundary_sensitive"
  | "insufficient";

export type NodeState = "established" | "present" | "absent";
export type Capacity = "supported" | "candidate" | "fragile";
export type RelationNode =
  | "input"
  | "output"
  | "peer"
  | "authority"
  | "completion";

export type VisibleStemFact = {
  position: "year" | "month" | "hour";
  stem: Stem;
  relation: TenRelation;
};

export type HiddenStemFact = {
  position: "year" | "month" | "day" | "hour";
  branch: Branch;
  stem: Stem;
  relation: TenRelation;
  isMain: boolean;
};

export type ChartFacts = {
  pillars: FourPillars;
  visibleStems: VisibleStemFact[];
  hiddenStems: HiddenStemFact[];
  nodes: Record<RelationNode, NodeState>;
  capacity: Capacity;
  timeStability: TimeStability;
  uncertaintyCount: number;
};

export type SignatureId = "SIG-A1" | "SIG-A2" | "SIG-B1" | "SIG-C1";
export type SignatureLevel = "supported" | "candidate" | "closed";

export type SignatureAssessment = {
  id: SignatureId;
  level: SignatureLevel;
  routeComplete: boolean;
  uncertaintyCount: number;
  stableAcrossCharts: boolean;
  evidenceClusters: string[];
};

export type SignatureCandidate = SignatureAssessment & {
  rank: number;
};

export type ChartCandidate = {
  key: string;
  facts: ChartFacts;
  convention:
    | "civil"
    | "zi_hour_day_rollover"
    | "hour_boundary"
    | "solar_term_boundary"
    | "approximate_time"
    | "unknown_time";
};

export type ChartResolution = {
  charts: ChartCandidate[];
  candidates: SignatureCandidate[];
  timeStability: TimeStability;
  notices: string[];
};

export type BirthResolutionResult =
  | { ok: true; value: ChartResolution }
  | {
      ok: false;
      error:
        | "invalid_input"
        | "nonexistent_local_time"
        | "too_many_candidates"
        | "calculation_failed";
    };

export type BirthErrorCode =
  | "invalid_input"
  | "nonexistent_local_time"
  | "too_many_candidates"
  | "calculation_failed";

export type QuestionPair = `${SignatureId}|${SignatureId}`;
export type AnswerChoice = "left" | "right" | "uncertain";

export type CalibrationQuestion = {
  id: string;
  pair: [SignatureId, SignatureId];
  contextTag: string;
  prompt: string;
  left: string;
  right: string;
  uncertain: string;
  copyVersion: "demo-copy-v0.1";
};

export type QuestionInstance = {
  instanceId: string;
  question: CalibrationQuestion;
  reversed: boolean;
};

export type AnswerRecord = {
  questionInstanceId: string;
  questionId: string;
  selected: AnswerChoice;
  supportedSignature: SignatureId | null;
  contextTag: string;
};

export type VerdictRelation =
  | "aligned"
  | "adapted"
  | "mixed"
  | "unresolved";

export type CalibrationVerdict = {
  relation: VerdictRelation;
  chartRoute: SignatureId | null;
  realityRoutes: SignatureId[];
  answerCount: number;
};

export type DemoStep =
  | "birth_input"
  | "resolving"
  | "boundary_notice"
  | "question"
  | "transition"
  | "result"
  | "share"
  | "error";

export type DemoError = {
  code: BirthErrorCode;
  message: string;
};

export type DemoState = {
  step: DemoStep;
  birthInput: BirthInput | null;
  chartResolution: ChartResolution | null;
  questions: QuestionInstance[];
  answers: AnswerRecord[];
  verdict: CalibrationVerdict | null;
  error: DemoError | null;
};
