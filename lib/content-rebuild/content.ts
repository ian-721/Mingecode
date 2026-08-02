import { CONTENT_REBUILD_PREVIEW } from "@/data/content-rebuild-preview";
import { selectManifestationBlocks } from "./manifestation";
import type {
  ContentResult,
  ManifestationAnswer,
  NonEstablishedContentResult,
} from "./preview-types";
import type { MechanismId, StaticRuleEngineResult } from "./types";

const STATE_COPY: Record<
  Exclude<StaticRuleEngineResult["finalState"], "established">,
  { title: string; explanation: string }
> = {
  candidate: {
    title: "这条结构有支持，但还没有唯一站稳",
    explanation:
      "命盘里已经出现了可追踪的方向，但独立证据、最近邻边界或完整链路还不足以把它写成单一人格结果。",
  },
  conflicted: {
    title: "两股结构正在同时拉扯",
    explanation:
      "现有证据不是没有方向，而是支持与反证同时成立。这里保留冲突，比选一个更好听的答案诚实。",
  },
  not_supported: {
    title: "这次先不替你定型",
    explanation:
      "当前命盘事实不足以通过核心门。资料不足或结构不支持时，不用几道题把一个人格硬投出来。",
  },
  boundary_sensitive: {
    title: "时间边界改变了核心方向",
    explanation:
      "几个合理候选盘给出了不同核心机制。这里展示共同结构和候选范围，不用多数票或问题答案消除边界。",
  },
};

export function assembleContentResult(
  engine: StaticRuleEngineResult,
  answers: readonly ManifestationAnswer[] = [],
): ContentResult {
  if (engine.finalState === "established" && engine.coreMechanism) {
    const definition = CONTENT_REBUILD_PREVIEW[engine.coreMechanism];
    return {
      status: "established",
      mechanism: engine.coreMechanism,
      title: definition.title,
      chartEntry: definition.chartEntry,
      recognition: definition.recognition,
      corePersonality: definition.corePersonality,
      structuralTension: definition.structuralTension,
      staticHighlight: definition.staticHighlight,
      staticCrash: definition.staticCrash,
      modernMisread: definition.modernMisread,
      recognitionLine: definition.recognitionLine,
      counterexample: definition.counterexample,
      manifestationBlocks: selectManifestationBlocks(
        engine.coreMechanism,
        answers,
      ),
      questions: definition.questions,
    };
  }

  const finalState =
    engine.finalState === "established" ? "not_supported" : engine.finalState;
  const stateCopy = STATE_COPY[finalState];
  const candidates = collectCandidateMechanisms(engine);
  const candidateTitles = candidates.map(
    (mechanism) => CONTENT_REBUILD_PREVIEW[mechanism].title,
  );

  const result: NonEstablishedContentResult = {
    status: finalState,
    title: stateCopy.title,
    explanation: stateCopy.explanation,
    candidateTitles,
    sharedStructure: describeSharedStructure(engine, candidates),
  };
  return result;
}

function collectCandidateMechanisms(
  engine: StaticRuleEngineResult,
): readonly MechanismId[] {
  const values = [
    ...engine.coreCandidates,
    ...engine.candidateResults.flatMap((result) => result.coreCandidates),
  ];
  return [...new Set(values)].sort();
}

function describeSharedStructure(
  engine: StaticRuleEngineResult,
  candidates: readonly MechanismId[],
): string {
  const knownDimensions = Object.entries(engine.dimensions)
    .filter(([, value]) => value !== "unresolved")
    .map(([key, value]) => `${key}=${value}`);

  if (candidates.length > 0) {
    const names = candidates
      .map((mechanism) => CONTENT_REBUILD_PREVIEW[mechanism].title)
      .join("、");
    return `目前可确认的候选包括：${names}。${
      knownDimensions.length > 0
        ? `共同可见结构：${knownDimensions.join("；")}。`
        : "当前没有足够稳定的共同维度。"
    }`;
  }

  return knownDimensions.length > 0
    ? `当前只确认到这些结构状态：${knownDimensions.join("；")}。`
    : "当前事实不足以形成稳定的共同结构。";
}
