import { describe, expect, it } from "vitest";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { selectManifestationBlocks } from "@/lib/content-rebuild/manifestation";
import type { StaticRuleEngineInput } from "@/lib/content-rebuild/types";

const baseInput: StaticRuleEngineInput = {
  timeBasisVersion: "civil_time_v1",
  candidates: [
    {
      candidateId: "manifestation-core-proof",
      facts: {
        precision: "exact",
        missingPositions: [],
        seasonalStrength: {
          subject: "旺",
          peer: "旺",
          input: "相",
          output: "休",
          resource: "囚",
          constraint: "死",
        },
        occurrences: [
          {
            role: "subject",
            kind: "day_anchor",
            objectKey: "proof-s",
            originClusterKey: "p1",
            hiddenStemProportion: null,
            rootOccurrence: false,
          },
          {
            role: "input",
            kind: "hidden",
            objectKey: "proof-i",
            originClusterKey: "p2",
            hiddenStemProportion: 0.6,
            rootOccurrence: true,
          },
          {
            role: "output",
            kind: "hidden",
            objectKey: "proof-o",
            originClusterKey: "p3",
            hiddenStemProportion: 0.6,
            rootOccurrence: true,
          },
          {
            role: "resource",
            kind: "hidden",
            objectKey: "proof-r",
            originClusterKey: "p4",
            hiddenStemProportion: 0.3,
            rootOccurrence: true,
          },
        ],
      },
    },
  ],
};

function coreProjection(result: ReturnType<typeof evaluateContentRebuild>) {
  return {
    candidateResults: result.candidateResults,
    nodeAvailability: result.nodeAvailability,
    evidence: result.evidence,
    dimensions: result.dimensions,
    coreCandidates: result.coreCandidates,
    coreMechanism: result.coreMechanism,
    finalState: result.finalState,
  };
}

describe("manifestation isolation", () => {
  it("keeps every core layer byte-equivalent across answers", () => {
    const baseline = evaluateContentRebuild(baseInput);
    const selected = evaluateContentRebuild({
      ...baseInput,
      manifestationAnswers: [
        { questionId: "proof-1", answer: "selected" },
        { questionId: "proof-2", answer: "reverse" },
      ],
    });
    expect(coreProjection(selected)).toEqual(coreProjection(baseline));
    expect(selected.manifestationVariant).toBe("reverse");
  });

  it("selects only approved blocks for the established mechanism", () => {
    const blocks = selectManifestationBlocks("A03", [
      { questionId: "A03.draft.threshold", optionId: "rough" },
      { questionId: "A03.failure.attribution", optionId: "method" },
    ]);
    expect(blocks.map((block) => block.id)).toEqual([
      "A03.highlight.iterate",
      "A03.reality.method",
    ]);
  });

  it("rejects cross-mechanism and duplicate answers", () => {
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
  });
});
