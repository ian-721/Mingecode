import type { FourPillars } from "@/lib/types";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { adaptPillarsToChartFacts } from "@/lib/content-rebuild/adapter";

const S01: FourPillars = {
  year: { stem: "乙", branch: "亥" },
  month: { stem: "癸", branch: "未" },
  day: { stem: "甲", branch: "寅" },
  hour: { stem: "甲", branch: "子" },
};

export function assertRepresentativeContentTraces(): void {
  const result = evaluateContentRebuild({
    timeBasisVersion: "civil_time_v1",
    candidates: [
      {
        candidateId: "S01",
        facts: adaptPillarsToChartFacts(S01, "exact", []),
      },
    ],
  });

  if (
    result.nodeAvailability.subject !== "usable" ||
    result.dimensions.D1 !== "supply_continuous"
  ) {
    throw new Error(
      `S01 subject/D1 failed: ${result.nodeAvailability.subject}/${result.dimensions.D1}`,
    );
  }
}
