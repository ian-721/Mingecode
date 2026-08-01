import {
  getHiddenStems,
  getTenRelation,
  type FourPillars,
} from "@4n6h4x0r/stem-branch";
import { adaptChartResolution } from "@/lib/content-rebuild/adapter";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { createChartPrompt, deriveChartFacts } from "@/lib/signatures";
import type { BirthInput, ChartResolution } from "@/lib/types";
import type { MechanismId } from "@/lib/content-rebuild/types";

const tools = { getHiddenStems, getTenRelation };

const REPRESENTATIVE_TRACES: readonly {
  readonly id: string;
  readonly pillars: FourPillars;
  readonly expected: MechanismId;
}[] = [
  {
    id: "S01",
    pillars: {
      year: { stem: "乙", branch: "亥" },
      month: { stem: "癸", branch: "未" },
      day: { stem: "甲", branch: "寅" },
      hour: { stem: "甲", branch: "子" },
    },
    expected: "A01",
  },
  {
    id: "S02",
    pillars: {
      year: { stem: "壬", branch: "午" },
      month: { stem: "丙", branch: "午" },
      day: { stem: "乙", branch: "丑" },
      hour: { stem: "辛", branch: "巳" },
    },
    expected: "A02",
  },
  {
    id: "S03",
    pillars: {
      year: { stem: "己", branch: "卯" },
      month: { stem: "癸", branch: "酉" },
      day: { stem: "己", branch: "丑" },
      hour: { stem: "乙", branch: "丑" },
    },
    expected: "A03",
  },
  {
    id: "S04",
    pillars: {
      year: { stem: "辛", branch: "巳" },
      month: { stem: "辛", branch: "卯" },
      day: { stem: "丙", branch: "戌" },
      hour: { stem: "辛", branch: "卯" },
    },
    expected: "A04",
  },
];

export function assertRepresentativeContentTraces(): void {
  for (const trace of REPRESENTATIVE_TRACES) {
    const facts = deriveChartFacts(trace.pillars, true, tools);
    const key = [
      trace.pillars.year,
      trace.pillars.month,
      trace.pillars.day,
      trace.pillars.hour,
    ]
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
    const result = evaluateContentRebuild(
      adaptChartResolution(input, resolution),
    );
    if (
      result.finalState !== "established" ||
      result.coreMechanism !== trace.expected
    ) {
      throw new Error(
        `${trace.id} representative trace expected ${trace.expected}, received ${result.coreMechanism ?? "none"}/${result.finalState}`,
      );
    }
  }
}
