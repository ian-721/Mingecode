import { describe, expect, it } from "vitest";
import { assembleContentResult } from "@/lib/content-rebuild/content";
import type {
  DimensionStates,
  MechanismId,
  StaticRuleEngineResult,
} from "@/lib/content-rebuild/types";

const unresolvedDimensions: DimensionStates = {
  D1: "unresolved",
  D2: "unresolved",
  D3: "unresolved",
  D4: "unresolved",
  D5: "unresolved",
  D6: "unresolved",
};

function engineResult(
  finalState: StaticRuleEngineResult["finalState"],
  coreMechanism: MechanismId | null,
  coreCandidates: readonly MechanismId[] = [],
): StaticRuleEngineResult {
  return {
    finalState,
    coreMechanism,
    coreCandidates,
    dimensions: unresolvedDimensions,
    candidateResults: coreCandidates.map((mechanism, index) => ({
      candidateId: `candidate-${index}`,
      coreCandidates: [mechanism],
    })),
  } as unknown as StaticRuleEngineResult;
}

describe("assembleContentResult", () => {
  it.each([
    ["A01", "自带坐标系的人"],
    ["A02", "会发光，也会过热的人"],
    ["A03", "内置质检部的人"],
    ["A04", "灵感也要过验收的人"],
  ] as const)("binds %s to its approved content", (mechanism, title) => {
    const result = assembleContentResult(
      engineResult("established", mechanism, [mechanism]),
    );
    expect(result.status).toBe("established");
    if (result.status !== "established") return;
    expect(result.title).toBe(title);
    expect(result.corePersonality.length).toBeGreaterThan(30);
    expect(result.counterexample.length).toBeGreaterThan(20);
    expect(result.questions).toHaveLength(2);
  });

  it("does not force a result across a time boundary", () => {
    const result = assembleContentResult(
      engineResult("boundary_sensitive", null, ["A01", "A04"]),
    );
    expect(result.status).toBe("boundary_sensitive");
    if (result.status === "established") return;
    expect(result.candidateTitles).toEqual([
      "自带坐标系的人",
      "灵感也要过验收的人",
    ]);
    expect(result.explanation).toContain("不同核心机制");
  });

  it("keeps not-supported output free of archetype claims", () => {
    const result = assembleContentResult(
      engineResult("not_supported", null),
    );
    expect(result.status).toBe("not_supported");
    if (result.status === "established") return;
    expect(result.candidateTitles).toEqual([]);
    expect(result.title).toBe("这次先不替你定型");
  });
});
