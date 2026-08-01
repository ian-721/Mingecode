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

const S01: FourPillars = {
  year: { stem: "乙", branch: "亥" },
  month: { stem: "癸", branch: "未" },
  day: { stem: "甲", branch: "寅" },
  hour: { stem: "甲", branch: "子" },
};

export function assertRepresentativeContentTraces(): void {
  const facts = deriveChartFacts(S01, true, tools);
  const key = [S01.year, S01.month, S01.day, S01.hour]
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
  if (result.candidateResults[0].nodeAvailability.subject !== "usable") {
    throw new Error("S01 subject capacity is not usable");
  }
}
