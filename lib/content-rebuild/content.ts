import { CONTENT_REBUILD_PREVIEW } from "@/data/content-rebuild-preview";
import { selectManifestationBlocks } from "./manifestation";
import type {
  CandidateSummary,
  ContentResult,
  ManifestationAnswer,
  NonEstablishedContentResult,
  SafeSharePayload,
} from "./preview-types";
import type { MechanismId, StaticRuleEngineResult } from "./types";

const STATE_COPY = {
  unique_candidate: {
    stateLabel: "最接近的结构候选",
    title: "方向已经出现，但还没有定型",
    explanation:
      "目前有一个方向比其他方向更接近完整结构，但证据与相邻边界还没有同时站稳。它是候选，不是最终人格标签。",
    commonGround: "命盘已经给出一条可追踪的结构方向。",
    differences:
      "还缺少把这条方向写成完整结果的充分条件。问题只补充现实表现，不会把候选晋升为已成立。",
  },
  multi_candidate: {
    stateLabel: "并列结构候选",
    title: "几个方向都在，但不该替它们排队",
    explanation:
      "不止一个结构方向得到了支持，而当前证据没有提供可靠的唯一优先级。这里并列保留，不挑一个更像答案的硬选。",
    commonGround: "这些候选都得到了一部分命盘结构支持。",
    differences:
      "它们由不同的结构关系成立，当前还不能被压成同一种人格。问题不会替命盘做最终选择。",
  },
  conflicted: {
    stateLabel: "结构冲突",
    title: "证据很活跃，但正在互相拉扯",
    explanation:
      "这不是计算失败。当前盘里的支持与反证同时落在关键结构上，强行选一个胜者会掩盖真正的冲突。",
    commonGround: "可以确认的是：当前结构存在真实张力，而不是没有任何信息。",
    differences:
      "冲突尚未被同一套证据诚实地关闭，因此不会输出完整人格认领，也不会用问题消除它。",
  },
  not_supported: {
    stateLabel: "暂不支持可靠归类",
    title: "这四种结构，这次都不该硬套",
    explanation:
      "当前命盘事实不足以让四种研究候选中的任何一种可靠成立。与其塞进最接近的类型，这次保留不归类。",
    commonGround: "不归类本身也是正式结果：它保护你不被不足的模型过度解释。",
    differences:
      "这里不会展示伪装成答案的“最接近类型”，也不会靠答题补出命盘里没有的核心。",
  },
  boundary_sensitive: {
    stateLabel: "时间边界敏感",
    title: "合理的时间候选，改变了核心方向",
    explanation:
      "出生时间的不确定或边界候选带来了不同核心结果。这里把差异留在桌面上，不用多数票或几道题把边界抹平。",
    commonGround: "每个候选都按同一套确定性规则独立计算，没有固定优先级。",
    differences:
      "不同时间候选支持的核心方向并不一致；补充现实问题也不能替代缺失或边界中的出生时间。",
  },
} as const;

export function assembleContentResult(
  engine: StaticRuleEngineResult,
  answers: readonly ManifestationAnswer[] = [],
): ContentResult {
  if (engine.finalState === "established") {
    if (!engine.coreMechanism) {
      throw new Error("Established engine result is missing a core mechanism");
    }
    const definition = CONTENT_REBUILD_PREVIEW[engine.coreMechanism];
    return {
      status: "established",
      stateLabel: "核心结构已成立",
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

  const mechanisms = collectCandidateMechanisms(engine);
  const candidates = mechanisms.map(candidateSummary);
  const status =
    engine.finalState === "candidate"
      ? mechanisms.length === 1
        ? "unique_candidate"
        : "multi_candidate"
      : engine.finalState;
  const copy = STATE_COPY[status];

  const result: NonEstablishedContentResult = {
    status,
    stateLabel: copy.stateLabel,
    title: copy.title,
    explanation: copy.explanation,
    candidates,
    commonGround: copy.commonGround,
    differences: copy.differences,
  };
  return result;
}

export function createSafeSharePayload(content: ContentResult): SafeSharePayload {
  if (content.status === "established") {
    return {
      productName: "命格译码",
      stateLabel: content.stateLabel,
      title: content.title,
      recognition: content.recognitionLine,
      highlight: content.staticHighlight,
      crash: content.staticCrash,
      disclaimer: "文化研究与娱乐表达，不是预测、心理诊断或人生建议。",
      returnPath: "/content-preview",
    };
  }

  return {
    productName: "命格译码",
    stateLabel: content.stateLabel,
    title: content.title,
    recognition: content.explanation,
    highlight: content.commonGround,
    crash: content.differences,
    disclaimer: "文化研究与娱乐表达，不是预测、心理诊断或人生建议。",
    returnPath: "/content-preview",
  };
}

function collectCandidateMechanisms(
  engine: StaticRuleEngineResult,
): readonly MechanismId[] {
  const values = [
    ...engine.coreCandidates,
    ...engine.candidateResults.flatMap((result) => result.coreCandidates),
  ];
  return [...new Set(values)].sort(ordinalCompare);
}

function candidateSummary(mechanism: MechanismId): CandidateSummary {
  const definition = CONTENT_REBUILD_PREVIEW[mechanism];
  return {
    title: definition.title,
    structuralSignal: definition.candidateSignal,
  };
}

function ordinalCompare(left: string, right: string): number {
  return left === right ? 0 : left < right ? -1 : 1;
}
