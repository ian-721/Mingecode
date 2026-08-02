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
};

export type EstablishedContentResult = {
  readonly status: "established";
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

export type NonEstablishedContentResult = {
  readonly status:
    | "candidate"
    | "conflicted"
    | "not_supported"
    | "boundary_sensitive";
  readonly title: string;
  readonly explanation: string;
  readonly candidateTitles: readonly string[];
  readonly sharedStructure: string;
};

export type ContentResult =
  | EstablishedContentResult
  | NonEstablishedContentResult;

export type PreviewEvaluation = {
  readonly engine: StaticRuleEngineResult;
  readonly content: ContentResult;
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
