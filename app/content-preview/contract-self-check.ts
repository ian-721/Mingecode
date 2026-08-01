import {
  getHiddenStems,
  getTenRelation,
  type FourPillars,
} from "@4n6h4x0r/stem-branch";
import { adaptChartResolution } from "@/lib/content-rebuild/adapter";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { createChartPrompt, deriveChartFacts } from "@/lib/signatures";
import type { BirthInput, ChartResolution } from "@/lib/types";

const tools = { getHiddenStems, getTenRelation };

const S02: FourPillars = {
  year: { stem: "壬", branch: "午" },
  month: { stem: "丙", branch: "午" },
  day: { stem: "乙", branch: "丑" },
  hour: { stem: "辛", branch: "巳" },
};

export function assertRepresentativeContentTraces(): void {
  const facts = deriveChartFacts(S02, true, tools);
  const key = [S02.year, S02.month, S02.day, S02.hour]
    .map((pillar) => `${pillar.stem}${pillar.branch}`)
    .join("|");
  const resolution: ChartResolution = {
    timeConventionVersion: "civil_time_v1",
    charts: [{ key, facts, convention: "civil" }],
    chartPrompt: createChartPrompt([facts], false),
    timeStability: "stable",
    notices: [],
  };
  const input: BirthInput = {
    date: "2000-01-01",
    time: "12:00",
    timePrecision: "exact",
    cityId: "representative-trace",
  };
  const result = evaluateContentRebuild(adaptChartResolution(input, resolution));
  if (result.candidateResults[0].dimensions.D2 !== "output_visible_asymmetric") {
    throw new Error("S02 D2 is not output_visible_asymmetric");
  }
}
