import { describe, expect, it } from "vitest";
import { createChartPrompt } from "@/lib/signatures";
import type {
  ChartFacts,
  CueFamily,
  HiddenStemFact,
  VisibleStemFact,
} from "@/lib/types";

const relationByFamily: Record<
  CueFamily,
  VisibleStemFact["relation"]
> = {
  input: "正印",
  output: "食神",
  peer: "比肩",
  authority: "正官",
  completion: "正財",
};

describe("R2 chart cue fixtures", () => {
  it("R2-C01 keeps stable visible output ahead of zero-match routes without producing votes", () => {
    const prompt = createChartPrompt(
      [
        facts({ visible: ["output"], hidden: ["input"] }),
        facts({ visible: ["output"] }),
      ],
      false,
    );

    expect(cue(prompt, "output")).toBe("stable_visible");
    expect(cue(prompt, "input")).toBe("variant");
    expect(prompt.routeOrder.indexOf("SIG-A2")).toBeLessThan(
      prompt.routeOrder.indexOf("SIG-B1"),
    );
    expect(prompt).not.toHaveProperty("routeSupport");
  });

  it("R2-C02 prioritizes A1 for stable input and output while completion variant adds no match", () => {
    const prompt = createChartPrompt(
      [
        facts({
          visible: ["input", "output"],
          hidden: ["completion"],
        }),
        facts({ visible: ["input", "output"] }),
      ],
      false,
    );

    expect(prompt.primaryRoute).toBe("SIG-A1");
    expect(cue(prompt, "completion")).toBe("variant");
    expect(prompt.uncertaintyFlags).toContain("boundary_variant");
  });

  it("R2-C03 marks an unobserved authority cue unknown when the hour is unknown", () => {
    const prompt = createChartPrompt([facts({ visible: ["output"] })], true);

    expect(cue(prompt, "authority")).toBe("unknown");
    expect(prompt.uncertaintyFlags).toContain("unknown_hour");
  });

  it("R2-C04 uses the fixed route order when every route has the same match", () => {
    const prompt = createChartPrompt([facts({})], false);

    expect(prompt.routeOrder).toEqual([
      "SIG-A1",
      "SIG-A2",
      "SIG-B1",
      "SIG-C1",
    ]);
  });
});

function facts({
  visible = [],
  hidden = [],
}: {
  visible?: CueFamily[];
  hidden?: CueFamily[];
}): ChartFacts {
  return {
    pillars: {
      year: { stem: "甲", branch: "子" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "戊", branch: "辰" },
      hour: { stem: "庚", branch: "午" },
    },
    visibleStems: visible.map(
      (family, index): VisibleStemFact => ({
        position: index === 0 ? "year" : index === 1 ? "month" : "hour",
        stem: index === 0 ? "甲" : index === 1 ? "丙" : "庚",
        relation: relationByFamily[family],
      }),
    ),
    hiddenStems: hidden.map(
      (family, index): HiddenStemFact => ({
        position: index === 0 ? "month" : "day",
        branch: index === 0 ? "寅" : "辰",
        stem: index === 0 ? "丙" : "戊",
        relation: relationByFamily[family],
        isMain: true,
      }),
    ),
  };
}

function cue(
  prompt: ReturnType<typeof createChartPrompt>,
  family: CueFamily,
) {
  return prompt.cues.find((item) => item.family === family)?.state;
}
