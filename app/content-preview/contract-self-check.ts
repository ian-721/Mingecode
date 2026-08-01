import type { FourPillars } from "@/lib/types";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { adaptPillarsToChartFacts } from "@/lib/content-rebuild/adapter";

const REPRESENTATIVE_TRACES: readonly {
  readonly id: string;
  readonly pillars: FourPillars;
  readonly expected: "A01" | "A02" | "A03" | "A04";
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
];

export function assertRepresentativeContentTraces(): void {
  for (const trace of REPRESENTATIVE_TRACES) {
    const facts = adaptPillarsToChartFacts(trace.pillars, "exact", []);
    const result = evaluateContentRebuild({
      timeBasisVersion: "civil_time_v1",
      candidates: [{ candidateId: trace.id, facts }],
    });

    if (
      result.coreMechanism !== trace.expected ||
      result.finalState !== "established"
    ) {
      throw new Error(
        `${trace.id} expected ${trace.expected}/established but got ${result.coreMechanism ?? "none"}/${result.finalState}`,
      );
    }
  }
}
