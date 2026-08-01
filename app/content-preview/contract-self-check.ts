import type { FourPillars } from "@/lib/types";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { adaptPillarsToChartFacts } from "@/lib/content-rebuild/adapter";

const S01: FourPillars = {
  year: { stem: "乙", branch: "亥" },
  month: { stem: "癸", branch: "未" },
  day: { stem: "甲", branch: "寅" },
  hour: { stem: "甲", branch: "子" },
};

const S02: FourPillars = {
  year: { stem: "壬", branch: "午" },
  month: { stem: "丙", branch: "午" },
  day: { stem: "乙", branch: "丑" },
  hour: { stem: "辛", branch: "巳" },
};

function evaluate(pillars: FourPillars, candidateId: string) {
  return evaluateContentRebuild({
    timeBasisVersion: "civil_time_v1",
    candidates: [
      {
        candidateId,
        facts: adaptPillarsToChartFacts(pillars, "exact", []),
      },
    ],
  });
}

export function assertRepresentativeContentTraces(): void {
  const s01 = evaluate(S01, "S01");
  if (s01.coreMechanism !== "A01" || s01.finalState !== "established") {
    throw new Error("S01 full mechanism gate failed");
  }

  const s02 = evaluate(S02, "S02");
  if (
    s02.dimensions.D2 !== "output_visible_asymmetric" ||
    s02.dimensions.D5 !== "output_constraint_regulating"
  ) {
    throw new Error(
      `S02 D2/D5 failed: ${s02.dimensions.D2}/${s02.dimensions.D5}`,
    );
  }
}
