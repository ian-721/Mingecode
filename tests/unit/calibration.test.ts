import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import {
  decideVerdict,
  shouldAskFourth,
} from "@/lib/calibration";
import type {
  AnswerRecord,
  SignatureCandidate,
  SignatureId,
} from "@/lib/types";

const candidates: SignatureCandidate[] = [
  candidate("SIG-A1", 1, "supported"),
  candidate("SIG-B1", 2, "candidate"),
  candidate("SIG-C1", 3, "candidate"),
];

describe("calibration and relation fixtures", () => {
  it("keeps exactly twelve approved question slots", () => {
    expect(QUESTIONS).toHaveLength(12);
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(12);
    expect(
      QUESTIONS.every(
        (question) => question.copyVersion === "demo-copy-v0.1",
      ),
    ).toBe(true);
  });

  it("produces aligned when the chart route leads twice", () => {
    expect(
      decideVerdict(candidates, [
        answer("SIG-A1", "daily"),
        answer("SIG-A1", "pressure"),
        answer("SIG-B1", "group"),
      ]).relation,
    ).toBe("aligned");
  });

  it("produces adapted when a different route leads twice", () => {
    expect(
      decideVerdict(candidates, [
        answer("SIG-B1", "group"),
        answer("SIG-B1", "pressure"),
        answer("SIG-A1", "daily"),
      ]).relation,
    ).toBe("adapted");
  });

  it("produces mixed only with two stable routes in distinct contexts", () => {
    const verdict = decideVerdict(candidates, [
      answer("SIG-A1", "daily"),
      answer("SIG-A1", "solo"),
      answer("SIG-B1", "group"),
      answer("SIG-B1", "handoff"),
    ]);
    expect(verdict.relation).toBe("mixed");
    expect(verdict.realityRoutes).toHaveLength(2);
  });

  it("keeps a simple conflict unresolved", () => {
    expect(
      decideVerdict(candidates, [
        uncertain("one"),
        uncertain("two"),
        answer("SIG-A1", "daily"),
        uncertain("four"),
      ]).relation,
    ).toBe("unresolved");
  });

  it("S18 asks a fourth question for candidate-only conflict, then stays unresolved", () => {
    const candidateOnly = candidates.map((item) => ({
      ...item,
      level: "candidate" as const,
    }));
    const firstThree = [
      answer("SIG-A1", "daily"),
      answer("SIG-B1", "group"),
      uncertain("third"),
    ];
    expect(shouldAskFourth(candidateOnly, firstThree)).toBe(true);
    expect(
      decideVerdict(candidateOnly, [...firstThree, uncertain("fourth")])
        .relation,
    ).toBe("unresolved");
  });
});

function candidate(
  id: SignatureId,
  rank: number,
  level: SignatureCandidate["level"],
): SignatureCandidate {
  return {
    id,
    rank,
    level,
    routeComplete: true,
    uncertaintyCount: level === "supported" ? 0 : 1,
    stableAcrossCharts: true,
    evidenceClusters: [id],
  };
}

function answer(route: SignatureId, contextTag: string): AnswerRecord {
  return {
    questionInstanceId: contextTag,
    questionId: contextTag,
    selected: "left",
    supportedSignature: route,
    contextTag,
  };
}

function uncertain(contextTag: string): AnswerRecord {
  return {
    questionInstanceId: contextTag,
    questionId: contextTag,
    selected: "uncertain",
    supportedSignature: null,
    contextTag,
  };
}
