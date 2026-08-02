import { describe, expect, it } from "vitest";
import {
  getHiddenStems,
  getTenRelation,
  type FourPillars,
} from "@4n6h4x0r/stem-branch";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import {
  adaptChartResolution,
  adaptPillarsToChartFacts,
} from "@/lib/content-rebuild/adapter";
import { createChartPrompt, deriveChartFacts } from "@/lib/signatures";
import type { BirthInput, ChartResolution } from "@/lib/types";

const tools = { getHiddenStems, getTenRelation };

const fieldPillars: FourPillars = {
  year: { stem: "甲", branch: "子" },
  month: { stem: "丙", branch: "寅" },
  day: { stem: "甲", branch: "辰" },
  hour: { stem: "辛", branch: "未" },
};

const canonicalWitnesses: ReadonlyArray<{
  mechanism: "A01" | "A02" | "A03" | "A04";
  civilDateTime: string;
  pillars: FourPillars;
}> = [
  {
    mechanism: "A01",
    civilDateTime: "1964-02-15T22:30:00",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "甲", branch: "午" },
      hour: { stem: "乙", branch: "亥" },
    },
  },
  {
    mechanism: "A02",
    civilDateTime: "1964-02-09T16:30:00",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "戊", branch: "子" },
      hour: { stem: "庚", branch: "申" },
    },
  },
  {
    mechanism: "A03",
    civilDateTime: "1964-02-21T16:30:00",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "庚", branch: "子" },
      hour: { stem: "甲", branch: "申" },
    },
  },
  {
    mechanism: "A04",
    civilDateTime: "1964-02-14T16:30:00",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "癸", branch: "巳" },
      hour: { stem: "庚", branch: "申" },
    },
  },
];

const exactInput: BirthInput = {
  date: "1964-02-15",
  time: "00:30",
  timePrecision: "exact",
  cityId: "beijing",
};

function makeResolution(
  pillars: FourPillars = fieldPillars,
  includeHour = true,
): ChartResolution {
  const facts = deriveChartFacts(pillars, includeHour, tools);
  return {
    timeConventionVersion: "civil_time_v1",
    charts: [
      {
        key: includeHour
          ? `${pillars.year.stem}${pillars.year.branch}|${pillars.month.stem}${pillars.month.branch}|${pillars.day.stem}${pillars.day.branch}|${pillars.hour.stem}${pillars.hour.branch}`
          : `${pillars.year.stem}${pillars.year.branch}|${pillars.month.stem}${pillars.month.branch}|${pillars.day.stem}${pillars.day.branch}|unknown-hour`,
        convention: includeHour ? "civil" : "unknown_time",
        facts,
      },
    ],
    chartPrompt: createChartPrompt([facts], !includeHour),
    timeStability: includeHour ? "stable" : "insufficient",
    notices: [],
  };
}

describe("adaptChartResolution", () => {
  it("maps every approved field and omits contention in ordinary runtime", () => {
    const adapted = adaptChartResolution(exactInput, makeResolution());
    expect(adapted.timeBasisVersion).toBe("civil_time_v1");
    expect(adapted.candidates).toHaveLength(1);
    expect(adapted.candidates[0].facts.precision).toBe("exact");
    expect(adapted.candidates[0].facts.missingPositions).toEqual([]);
    expect(
      Object.hasOwn(adapted.candidates[0], "interfaceContentionFacts"),
    ).toBe(false);

    const facts = adapted.candidates[0].facts;
    expect(Object.keys(facts.seasonalStrength).sort()).toEqual([
      "constraint",
      "input",
      "output",
      "peer",
      "resource",
      "subject",
    ]);
    expect(facts.occurrences.filter((item) => item.kind === "day_anchor")).toEqual([
      expect.objectContaining({
        role: "subject",
        objectKey: "day:day_anchor:0:甲",
        hiddenStemProportion: null,
        rootOccurrence: false,
      }),
    ]);
    expect(
      facts.occurrences
        .filter((item) => item.kind === "hidden")
        .every(
          (item) =>
            item.rootOccurrence &&
            typeof item.hiddenStemProportion === "number" &&
            item.originClusterKey.startsWith("branch:"),
        ),
    ).toBe(true);
  });

  it("shares a visible stem only with one unique physical branch source", () => {
    const adapted = adaptChartResolution(exactInput, makeResolution());
    const yearVisible = adapted.candidates[0].facts.occurrences.find(
      (item) => item.objectKey === "year:visible:0:甲",
    );
    expect(yearVisible?.originClusterKey).toBe("branch:month:寅");
  });

  it("keeps approximate and multi-candidate resolutions bounded", () => {
    const approximate = adaptChartResolution(
      { ...exactInput, timePrecision: "approximate" },
      makeResolution(),
    );
    expect(approximate.candidates[0].facts.precision).toBe("bounded");

    const multi = makeResolution();
    multi.charts.push({
      ...multi.charts[0],
      key: `${multi.charts[0].key}|boundary`,
      convention: "hour_boundary",
    });
    const adaptedMulti = adaptChartResolution(exactInput, multi);
    expect(adaptedMulti.candidates).toHaveLength(2);
    expect(
      adaptedMulti.candidates.every((candidate) => candidate.facts.precision === "bounded"),
    ).toBe(true);
    expect(
      adaptedMulti.candidates.every(
        (candidate) => !Object.hasOwn(candidate, "interfaceContentionFacts"),
      ),
    ).toBe(true);
  });

  it("keeps unknown hour explicit and never invents hour occurrences", () => {
    const input: BirthInput = {
      ...exactInput,
      time: null,
      timePrecision: "unknown",
    };
    const adapted = adaptChartResolution(input, makeResolution(fieldPillars, false));
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

  it("rejects empty, duplicate, or non-civil-time resolutions", () => {
    const empty = makeResolution();
    empty.charts = [];
    expect(() => adaptChartResolution(exactInput, empty)).toThrow(
      /at least one chart/,
    );

    const duplicate = makeResolution();
    duplicate.charts.push({ ...duplicate.charts[0] });
    expect(() => adaptChartResolution(exactInput, duplicate)).toThrow(
      /duplicate chart candidate key/,
    );

    const wrongConvention = {
      ...makeResolution(),
      timeConventionVersion: "solar_time_v1",
    } as unknown as ChartResolution;
    expect(() => adaptChartResolution(exactInput, wrongConvention)).toThrow(
      /civil_time_v1/,
    );
  });

  it("never reads the legacy chart prompt or its target-like ordering", () => {
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

describe("Issue #30 canonical established witnesses", () => {
  it.each(canonicalWitnesses)(
    "$mechanism is naturally established at $civilDateTime",
    ({ mechanism, pillars }) => {
      const facts = adaptPillarsToChartFacts(pillars);
      const result = evaluateContentRebuild({
        timeBasisVersion: "civil_time_v1",
        candidates: [{ candidateId: "canonical-witness", facts }],
      });
      expect(result.finalState).toBe("established");
      expect(result.coreMechanism).toBe(mechanism);
      expect(result.candidateResults[0].interfaces).toBeDefined();
    },
  );
});
