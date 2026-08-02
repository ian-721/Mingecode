import { describe, expect, it } from "vitest";
import { CONTENT_REBUILD_PREVIEW } from "@/data/content-rebuild-preview";
import {
  assembleContentResult,
  createSafeSharePayload,
} from "@/lib/content-rebuild/content";
import type {
  ContentResult,
  EstablishedContentResult,
} from "@/lib/content-rebuild/preview-types";
import type {
  MechanismId,
  StaticRuleEngineResult,
} from "@/lib/content-rebuild/types";

function engineResult(
  finalState: StaticRuleEngineResult["finalState"],
  coreMechanism: MechanismId | null,
  coreCandidates: readonly MechanismId[] = [],
  candidateSets: readonly (readonly MechanismId[])[] = [],
): StaticRuleEngineResult {
  return {
    timeBasisVersion: "civil_time_v1",
    finalState,
    coreMechanism,
    coreCandidates,
    candidateResults: candidateSets.map((candidates, index) => ({
      candidateId: `candidate-${index}`,
      coreCandidates: candidates,
    })),
    manifestationVariant: "unselected",
  } as unknown as StaticRuleEngineResult;
}

function visibleEstablishedText(result: EstablishedContentResult): string {
  return JSON.stringify({
    stateLabel: result.stateLabel,
    title: result.title,
    chartEntry: result.chartEntry,
    recognition: result.recognition,
    corePersonality: result.corePersonality,
    structuralTension: result.structuralTension,
    staticHighlight: result.staticHighlight,
    staticCrash: result.staticCrash,
    modernMisread: result.modernMisread,
    recognitionLine: result.recognitionLine,
    counterexample: result.counterexample,
  });
}

describe("approved established content", () => {
  it.each([
    ["A01", "自带坐标系的人"],
    ["A02", "会发光，也会过热的人"],
    ["A03", "内置质检部的人"],
    ["A04", "灵感也要过验收的人"],
  ] as const)("binds %s to a complete approved result", (mechanism, title) => {
    const result = assembleContentResult(
      engineResult("established", mechanism, [mechanism]),
    );
    expect(result.status).toBe("established");
    if (result.status !== "established") return;

    expect(result.title).toBe(title);
    expect(result.stateLabel).toBe("核心结构已成立");
    expect(result.chartEntry.length).toBeGreaterThan(20);
    expect(result.corePersonality.length).toBeGreaterThan(30);
    expect(result.structuralTension.length).toBeGreaterThan(30);
    expect(result.staticHighlight.length).toBeGreaterThan(20);
    expect(result.staticCrash.length).toBeGreaterThan(20);
    expect(result.modernMisread.length).toBeGreaterThan(30);
    expect(result.recognitionLine.length).toBeGreaterThan(15);
    expect(result.counterexample.length).toBeGreaterThan(25);
    expect(result.questions).toHaveLength(2);
    expect(visibleEstablishedText(result)).not.toMatch(
      /\b(?:A0[1-4]|D[1-6]|E[1-6]|fixture|threshold)\b/i,
    );

    const trace = CONTENT_REBUILD_PREVIEW[mechanism].claimTrace;
    expect(Object.keys(trace).sort()).toEqual([
      "chartEntry",
      "corePersonality",
      "counterexample",
      "modernMisread",
      "recognitionLine",
      "staticCrash",
      "staticHighlight",
      "structuralTension",
    ]);
    expect(Object.values(trace).every((sources) => sources.length > 0)).toBe(true);
  });

  it("treats an inconsistent established result as a real runtime error", () => {
    expect(() =>
      assembleContentResult(engineResult("established", null)),
    ).toThrow(/missing a core mechanism/);
  });
});

describe("first-class non-established results", () => {
  it("renders a unique candidate without promoting it", () => {
    const result = assembleContentResult(
      engineResult("candidate", null, ["A04"]),
    );
    expect(result.status).toBe("unique_candidate");
    if (result.status === "established") return;
    expect(result.stateLabel).toBe("最接近的结构候选");
    expect(result.candidates).toEqual([
      expect.objectContaining({ title: "灵感也要过验收的人" }),
    ]);
    expect(result.differences).toContain("不会把候选晋升为已成立");
  });

  it("keeps multiple candidates parallel and unordered by preference", () => {
    const result = assembleContentResult(
      engineResult("candidate", null, ["A03", "A01"]),
    );
    expect(result.status).toBe("multi_candidate");
    if (result.status === "established") return;
    expect(result.candidates.map((candidate) => candidate.title)).toEqual([
      "自带坐标系的人",
      "内置质检部的人",
    ]);
    expect(result.explanation).toContain("没有提供可靠的唯一优先级");
  });

  it.each([
    ["conflicted", "结构冲突", "这不是计算失败"],
    ["not_supported", "暂不支持可靠归类", "与其塞进最接近的类型"],
    ["boundary_sensitive", "时间边界敏感", "不同核心结果"],
  ] as const)("renders %s as a formal product result", (state, label, phrase) => {
    const result = assembleContentResult(
      engineResult(
        state,
        null,
        state === "boundary_sensitive" ? ["A01", "A04"] : [],
      ),
    );
    expect(result.status).toBe(state);
    if (result.status === "established") return;
    expect(result.stateLabel).toBe(label);
    expect(result.explanation).toContain(phrase);
    const visible = JSON.stringify({
      stateLabel: result.stateLabel,
      title: result.title,
      explanation: result.explanation,
      candidates: result.candidates,
      commonGround: result.commonGround,
      differences: result.differences,
    });
    expect(visible).not.toMatch(/\b(?:A0[1-4]|D[1-6]|E[1-6]|fixture|threshold)\b/i);
  });
});

describe("privacy-safe share whitelist", () => {
  it.each([
    assembleContentResult(engineResult("established", "A02", ["A02"])),
    assembleContentResult(engineResult("candidate", null, ["A04"])),
    assembleContentResult(engineResult("candidate", null, ["A01", "A03"])),
    assembleContentResult(engineResult("conflicted", null)),
    assembleContentResult(engineResult("not_supported", null)),
    assembleContentResult(
      engineResult("boundary_sensitive", null, ["A01", "A04"]),
    ),
  ] as readonly ContentResult[])("exports only approved public fields", (content) => {
    const payload = createSafeSharePayload(content);
    expect(Object.keys(payload).sort()).toEqual([
      "crash",
      "disclaimer",
      "highlight",
      "productName",
      "recognition",
      "returnPath",
      "stateLabel",
      "title",
    ]);
    expect(payload.returnPath).toBe("/content-preview");
    const serialized = JSON.stringify(payload);
    expect(serialized).not.toMatch(
      /1964|00:30|北京|甲辰|candidateId|coreMechanism|A0[1-4]|\bD[1-6]\b|\bE[1-6]\b|questionId|optionId/,
    );
  });
});
