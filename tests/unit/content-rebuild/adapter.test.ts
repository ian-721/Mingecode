import { describe, expect, it } from "vitest";
import {
  getHiddenStems,
  getTenRelation,
  type FourPillars,
} from "@4n6h4x0r/stem-branch";
import { adaptChartResolution } from "@/lib/content-rebuild/adapter";
import { createChartPrompt, deriveChartFacts } from "@/lib/signatures";
import type { BirthInput, ChartResolution } from "@/lib/types";

const pillars: FourPillars = {
  year: { stem: "甲", branch: "子" },
  month: { stem: "丙", branch: "寅" },
  day: { stem: "甲", branch: "辰" },
  hour: { stem: "辛", branch: "未" },
};

const tools = { getHiddenStems, getTenRelation };

function makeResolution(includeHour = true): ChartResolution {
  const facts = deriveChartFacts(pillars, includeHour, tools);
  return {
    timeConventionVersion: "civil_time_v1",
    charts: [
      {
        key: includeHour ? "甲子|丙寅|甲辰|辛未" : "甲子|丙寅|甲辰|unknown-hour",
        convention: includeHour ? "civil" : "unknown_time",
        facts,
      },
    ],
    chartPrompt: createChartPrompt([facts], !includeHour),
    timeStability: includeHour ? "stable" : "insufficient",
    notices: [],
  };
}

const exactInput: BirthInput = {
  date: "1990-01-01",
  time: "12:00",
  timePrecision: "exact",
  cityId: "sydney-au",
};

describe("adaptChartResolution", () => {
  it("maps one civil chart into exact atomic facts", () => {
    const adapted = adaptChartResolution(exactInput, makeResolution());
    expect(adapted.timeBasisVersion).toBe("civil_time_v1");
    expect(adapted.candidates).toHaveLength(1);
    expect(adapted.candidates[0].facts.precision).toBe("exact");
    expect(adapted.candidates[0].facts.missingPositions).toEqual([]);

    const occurrences = adapted.candidates[0].facts.occurrences;
    expect(occurrences.filter((item) => item.kind === "day_anchor")).toEqual([
      expect.objectContaining({ role: "subject", objectKey: "day:day_anchor:0:甲" }),
    ]);
    expect(occurrences.some((item) => item.kind === "hidden")).toBe(true);
    expect(
      occurrences
        .filter((item) => item.kind === "hidden")
        .every(
          (item) =>
            item.rootOccurrence &&
            typeof item.hiddenStemProportion === "number",
        ),
    ).toBe(true);
  });

  it("shares a visible stem with exactly one physical branch source", () => {
    const adapted = adaptChartResolution(exactInput, makeResolution());
    const yearVisible = adapted.candidates[0].facts.occurrences.find(
      (item) => item.objectKey === "year:visible:0:甲",
    );
    expect(yearVisible?.originClusterKey).toBe("branch:month:寅");
  });

  it("keeps unknown hour bounded and explicit", () => {
    const input: BirthInput = {
      ...exactInput,
      time: null,
      timePrecision: "unknown",
    };
    const adapted = adaptChartResolution(input, makeResolution(false));
    expect(adapted.candidates[0].facts.precision).toBe("bounded");
    expect(adapted.candidates[0].facts.missingPositions).toEqual([
      "hour.stem",
      "hour.branch",
    ]);
    expect(
      adapted.candidates[0].facts.occurrences.some((item) =>
        item.objectKey.startsWith("hour:"),
      ),
    ).toBe(false);
  });

  it("never reads the legacy chart prompt to choose a mechanism", () => {
    const resolution = makeResolution();
    resolution.chartPrompt.primaryRoute = "SIG-C1";
    resolution.chartPrompt.routeOrder = ["SIG-C1", "SIG-B1", "SIG-A2", "SIG-A1"];
    const first = adaptChartResolution(exactInput, resolution);
    resolution.chartPrompt.primaryRoute = "SIG-A1";
    resolution.chartPrompt.routeOrder.reverse();
    const second = adaptChartResolution(exactInput, resolution);
    expect(second).toEqual(first);
  });
});
