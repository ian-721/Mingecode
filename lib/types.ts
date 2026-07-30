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

export type CueFamily =
  | "input"
  | "output"
  | "peer"
  | "authority"
  | "completion";

export type CueState =
  | "stable_visible"
  | "stable_hidden"
  | "variant"
  | "not_observed"
  | "unknown";

export type ChartCue = {
  family: CueFamily;
  state: CueState;
};

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

export type ChartPillars = Omit<FourPillars, "hour"> & {
  hour: FourPillars["hour"] | null;
};

export type ChartFacts = {
  pillars: ChartPillars;
  visibleStems: VisibleStemFact[];
  hiddenStems: HiddenStemFact[];
};

export type SignatureId = "SIG-A1" | "SIG-A2" | "SIG-B1" | "SIG-C1";

export type ChartPrompt = {
  routeOrder: SignatureId[];
  primaryRoute: SignatureId;
  cues: ChartCue[];
  uncertaintyFlags: Array<
    | "unknown_hour"
    | "boundary_variant"
    | "insufficient_stable_cues"
  >;
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
  chartPrompt: ChartPrompt;
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
  pair: [SignatureId, SignatureId];
};

export type VerdictRelation =
  | "aligned"
  | "adapted"
  | "mixed"
  | "unresolved";

export type HybridVerdict = {
  modelVersion: "m1br-hybrid-r2-0.1";
  chartPrompt: ChartPrompt;
  calibration: {
    questionIds: string[];
    questionsUsed: 4 | 5 | 6;
    routeSupport: Partial<Record<SignatureId, number>>;
    uncertainCount: number;
  };
  reality: {
    primaryRoute: SignatureId | null;
    secondaryRoute: SignatureId | null;
  };
  relationship: VerdictRelation;
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
  verdict: HybridVerdict | null;
  error: DemoError | null;
};
