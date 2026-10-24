import { describe, expect, it } from "vitest";
import type { FourPillars } from "@4n6h4x0r/stem-branch";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { adaptPillarsToChartFacts } from "@/lib/content-rebuild/adapter";
import { assembleContentResult } from "@/lib/content-rebuild/content";
import {
  getManifestationQuestions,
  selectManifestationBlocks,
} from "@/lib/content-rebuild/manifestation";
import type { ManifestationAnswer } from "@/lib/content-rebuild/preview-types";
import type { MechanismId } from "@/lib/content-rebuild/types";

const canonicalWitnesses: ReadonlyArray<{
  mechanism: MechanismId;
  pillars: FourPillars;
}> = [
  {
    mechanism: "A01",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "甲", branch: "午" },
      hour: { stem: "甲", branch: "子" },
    },
  },
  {
    mechanism: "A02",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "戊", branch: "子" },
      hour: { stem: "庚", branch: "申" },
    },
  },
  {
    mechanism: "A03",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "乙", branch: "酉" },
      hour: { stem: "辛", branch: "巳" },
    },
  },
  {
    mechanism: "A04",
    pillars: {
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "癸", branch: "巳" },
      hour: { stem: "庚", branch: "申" },
    },
  },
];

describe("manifestation selection", () => {
  it.each(canonicalWitnesses)(
    "keeps every core byte identical across all 0/1/2-answer permutations for $mechanism",
    ({ mechanism, pillars }) => {
      const engineInput = {
        timeBasisVersion: "civil_time_v1" as const,
        candidates: [
          {
            candidateId: "issue-30-canonical-witness",
            facts: adaptPillarsToChartFacts(pillars),
          },
        ],
      };
      const baseline = evaluateContentRebuild(engineInput);
      expect(baseline.finalState).toBe("established");
      expect(baseline.coreMechanism).toBe(mechanism);
      const baselineBytes = JSON.stringify(baseline);
      const questions = getManifestationQuestions(mechanism);
      expect(questions).toHaveLength(2);

      const answerSets: ManifestationAnswer[][] = [[]];
      for (const first of questions[0].options) {
        answerSets.push([{ questionId: questions[0].id, optionId: first.id }]);
        for (const second of questions[1].options) {
          answerSets.push([
            { questionId: questions[0].id, optionId: first.id },
            { questionId: questions[1].id, optionId: second.id },
          ]);
        }
      }
      expect(answerSets).toHaveLength(13);

      for (const answers of answerSets) {
        const content = assembleContentResult(baseline, answers);
        expect(content.status).toBe("established");
        expect(JSON.stringify(baseline)).toBe(baselineBytes);

        const rerun = evaluateContentRebuild(engineInput);
        expect(JSON.stringify(rerun)).toBe(baselineBytes);
      }
    },
  );

  it("selects only blocks approved for the established mechanism", () => {
    const blocks = selectManifestationBlocks("A03", [
      { questionId: "A03.draft.threshold", optionId: "rough" },
      { questionId: "A03.failure.attribution", optionId: "method" },
    ]);
    expect(blocks.map((block) => block.id)).toEqual([
      "A03.highlight.iterate",
      "A03.reality.method",
    ]);
  });

  it("rejects cross-mechanism, duplicate, invalid, and excessive answers", () => {
    expect(() =>
      selectManifestationBlocks("A01", [
        { questionId: "A02.feedback.after", optionId: "continue" },
      ]),
    ).toThrow(/Unsupported manifestation question/);

    expect(() =>
      selectManifestationBlocks("A01", [
        { questionId: "A01.task.response", optionId: "reframe_first" },
        { questionId: "A01.task.response", optionId: "deliver_first" },
      ]),
    ).toThrow(/Duplicate manifestation answer/);

    expect(() =>
      selectManifestationBlocks("A04", [
        { questionId: "A04.value.feeling", optionId: "invented" },
      ]),
    ).toThrow(/Unsupported manifestation option/);

    expect(() =>
      selectManifestationBlocks("A02", [
        { questionId: "A02.feedback.after", optionId: "continue" },
        { questionId: "A02.conflict.style", optionId: "direct" },
        { questionId: "A02.feedback.after", optionId: "worry" },
      ]),
    ).toThrow(/at most two/);
  });
});
