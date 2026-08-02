import type { MechanismId, StaticRuleEngineResult } from "./types";

export type ManifestationSection =
  | "highlight"
  | "crash"
  | "relationship"
  | "reality";

export type ManifestationAnswer = {
  readonly questionId: string;
  readonly optionId: string;
};

export type ManifestationBlock = {
  readonly id: string;
  readonly section: ManifestationSection;
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
};

export type ManifestationOption = {
  readonly id: string;
  readonly label: string;
  readonly blockIds: readonly string[];
};

export type ManifestationQuestion = {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly ManifestationOption[];
};

export type PreviewContentDefinition = {
  readonly mechanism: MechanismId;
  readonly title: string;
  readonly candidateSignal: string;
  readonly chartEntry: string;
  readonly recognition: string;
  readonly corePersonality: string;
  readonly structuralTension: string;
  readonly staticHighlight: string;
  readonly staticCrash: string;
  readonly modernMisread: string;
  readonly recognitionLine: string;
  readonly counterexample: string;
  readonly questions: readonly ManifestationQuestion[];
  readonly blocks: readonly ManifestationBlock[];
  readonly claimTrace: Readonly<Record<
    | "chartEntry"
    | "corePersonality"
    | "structuralTension"
    | "staticHighlight"
    | "staticCrash"
    | "modernMisread"
    | "recognitionLine"
    | "counterexample",
    readonly string[]
  >>;
};

export type EstablishedContentResult = {
  readonly status: "established";
  readonly stateLabel: "核心结构已成立";
  readonly mechanism: MechanismId;
  readonly title: string;
  readonly chartEntry: string;
  readonly recognition: string;
  readonly corePersonality: string;
  readonly structuralTension: string;
  readonly staticHighlight: string;
  readonly staticCrash: string;
  readonly modernMisread: string;
  readonly recognitionLine: string;
  readonly counterexample: string;
  readonly manifestationBlocks: readonly ManifestationBlock[];
  readonly questions: readonly ManifestationQuestion[];
};

export type CandidateSummary = {
  readonly title: string;
  readonly structuralSignal: string;
};

export type NonEstablishedStatus =
  | "unique_candidate"
  | "multi_candidate"
  | "conflicted"
  | "not_supported"
  | "boundary_sensitive";

export type NonEstablishedContentResult = {
  readonly status: NonEstablishedStatus;
  readonly stateLabel: string;
  readonly title: string;
  readonly explanation: string;
  readonly candidates: readonly CandidateSummary[];
  readonly commonGround: string;
  readonly differences: string;
};

export type ContentResult =
  | EstablishedContentResult
  | NonEstablishedContentResult;

export type PreviewEvaluation = {
  readonly engine: StaticRuleEngineResult;
  readonly content: ContentResult;
};

export type SafeSharePayload = {
  readonly productName: "命格译码";
  readonly stateLabel: string;
  readonly title: string;
  readonly recognition: string;
  readonly highlight: string;
  readonly crash: string;
  readonly disclaimer: "文化研究与娱乐表达，不是预测、心理诊断或人生建议。";
  readonly returnPath: "/content-preview";
};

export type ContentPreviewStep =
  | "birth_input"
  | "resolving_birth"
  | "boundary_notice"
  | "evaluating_core"
  | "core_result"
  | "manifestation_question"
  | "share"
  | "error";
