import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/data/questions";
import {
  decideVerdict,
  rebuildQuestions,
  shouldAskFifth,
  shouldAskSixth,
} from "@/lib/calibration";
import { TIME_CONVENTION_VERSION } from "@/lib/types";
import type {
  AnswerRecord,
  ChartPrompt,
  SignatureId,
} from "@/lib/types";

const prompt = chartPrompt([
  "SIG-A1",
  "SIG-A2",
  "SIG-B1",
  "SIG-C1",
]);

describe("R2 calibration and relation fixtures", () => {
  it("keeps exactly twelve approved question slots", () => {
    expect(QUESTIONS).toHaveLength(12);
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(12);
    expect(
      QUESTIONS.every(
        (question) => question.copyVersion === "demo-copy-v0.1",
      ),
    ).toBe(true);
  });

  it("R2-Q01 ends after four answers for a 2/1/1/0 direct-comparison lead", () => {
    const answers = [
      answer("SIG-A1", "daily", ["SIG-A1", "SIG-A2"], "a1-a2-1"),
      answer("SIG-A1", "group", ["SIG-A1", "SIG-B1"], "a1-b1-1"),
      answer("SIG-A2", "creative", ["SIG-A2", "SIG-C1"], "a2-c1-1"),
      answer("SIG-B1", "handoff", ["SIG-B1", "SIG-C1"], "b1-c1-1"),
    ];

    expect(shouldAskFifth(prompt, answers)).toBe(false);
    const verdict = decideVerdict(prompt, answers);
    expect(verdict.relationship).toBe("aligned");
    expect(verdict.timeConventionVersion).toBe(TIME_CONVENTION_VERSION);
  });

  it("R2-Q02 enters Q5 after a four-way tie", () => {
    expect(
      shouldAskFifth(prompt, [
        answer("SIG-A1", "one", ["SIG-A1", "SIG-A2"], "one"),
        answer("SIG-A2", "two", ["SIG-A1", "SIG-A2"], "two"),
        answer("SIG-B1", "three", ["SIG-B1", "SIG-C1"], "three"),
        answer("SIG-C1", "four", ["SIG-B1", "SIG-C1"], "four"),
      ]),
    ).toBe(true);
  });

  it("R2-Q03 enters Q5 after two uncertain answers", () => {
    expect(
      shouldAskFifth(prompt, [
        uncertain("one", ["SIG-A1", "SIG-A2"]),
        uncertain("two", ["SIG-B1", "SIG-C1"]),
        answer("SIG-A1", "three", ["SIG-A1", "SIG-B1"], "three"),
        answer("SIG-A1", "four", ["SIG-A1", "SIG-C1"], "four"),
      ]),
    ).toBe(true);
  });

  it("R2-Q04 enters Q6 when the top two differ by one without direct comparison", () => {
    expect(
      shouldAskSixth(prompt, [
        answer("SIG-A1", "one", ["SIG-A1", "SIG-B1"], "one"),
        answer("SIG-A1", "two", ["SIG-A1", "SIG-C1"], "two"),
        answer("SIG-A2", "three", ["SIG-A2", "SIG-B1"], "three"),
        answer("SIG-B1", "four", ["SIG-B1", "SIG-C1"], "four"),
        uncertain("five", ["SIG-A2", "SIG-C1"]),
      ]),
    ).toBe(true);
  });

  it("R2-Q05 stays unresolved after six when the highest support is below two", () => {
    const verdict = decideVerdict(prompt, [
      answer("SIG-A1", "one", ["SIG-A1", "SIG-A2"], "one"),
      answer("SIG-A2", "two", ["SIG-A1", "SIG-A2"], "two"),
      answer("SIG-B1", "three", ["SIG-B1", "SIG-C1"], "three"),
      answer("SIG-C1", "four", ["SIG-B1", "SIG-C1"], "four"),
      uncertain("five", ["SIG-A1", "SIG-B1"]),
      uncertain("six", ["SIG-A2", "SIG-C1"]),
    ]);

    expect(verdict.relationship).toBe("unresolved");
    expect(verdict.reality.primaryRoute).toBeNull();
  });

  it("R2-Q06 produces mixed only for two supported routes with a 1:1 direct pair split", () => {
    const verdict = decideVerdict(prompt, [
      answer("SIG-A1", "daily", ["SIG-A1", "SIG-B1"], "a1-b1-1"),
      answer("SIG-B1", "group", ["SIG-A1", "SIG-B1"], "a1-b1-2"),
      answer("SIG-A1", "solo", ["SIG-A1", "SIG-A2"], "a1-a2-1"),
      answer("SIG-B1", "handoff", ["SIG-B1", "SIG-C1"], "b1-c1-1"),
      uncertain("five", ["SIG-A2", "SIG-C1"]),
      uncertain("six", ["SIG-A1", "SIG-C1"]),
    ]);

    expect(verdict.relationship).toBe("mixed");
    expect(verdict.reality).toEqual({
      primaryRoute: "SIG-A1",
      secondaryRoute: "SIG-B1",
    });
  });

  it("R2-Q07 produces aligned when the reality route equals the prompt route", () => {
    const verdict = decideVerdict(prompt, leadAnswers("SIG-A1", "SIG-A2"));
    expect(verdict.relationship).toBe("aligned");
  });

  it("R2-Q08 produces adapted when another reality route leads", () => {
    const verdict = decideVerdict(prompt, leadAnswers("SIG-B1", "SIG-A2"));
    expect(verdict.relationship).toBe("adapted");
  });

  it("R2-Q09 changing the chart prompt does not change answer support", () => {
    const answers = leadAnswers("SIG-B1", "SIG-A2");
    const changedPrompt = chartPrompt([
      "SIG-C1",
      "SIG-B1",
      "SIG-A2",
      "SIG-A1",
    ]);

    expect(decideVerdict(prompt, answers).calibration.routeSupport).toEqual(
      decideVerdict(changedPrompt, answers).calibration.routeSupport,
    );
  });

  it("R2-Q10 repeats the same deterministic question sequence", () => {
    const answers = [
      answer("SIG-A1", "one", ["SIG-A1", "SIG-A2"], "Q-A1A2-01"),
      answer("SIG-B1", "two", ["SIG-B1", "SIG-C1"], "Q-B1C1-01"),
      uncertain("three", ["SIG-A1", "SIG-B1"], "Q-A1B1-01"),
      answer("SIG-A1", "four", ["SIG-A1", "SIG-B1"], "Q-A1B1-02"),
    ];

    expect(rebuildQuestions(prompt, answers)).toEqual(
      rebuildQuestions(prompt, answers),
    );
  });
});

function leadAnswers(
  leader: SignatureId,
  second: SignatureId,
): AnswerRecord[] {
  const other = ["SIG-A1", "SIG-A2", "SIG-B1", "SIG-C1"].find(
    (route) => route !== leader && route !== second,
  ) as SignatureId;
  return [
    answer(leader, "one", [leader, second], "direct"),
    answer(leader, "two", [leader, other], "leader-other"),
    answer(second, "three", [second, other], "second-other"),
    uncertain("four", [leader, other]),
  ];
}

function chartPrompt(routeOrder: SignatureId[]): ChartPrompt {
  return {
    routeOrder,
    primaryRoute: routeOrder[0],
    cues: [],
    uncertaintyFlags: [],
  };
}

function answer(
  route: SignatureId,
  contextTag: string,
  pair: [SignatureId, SignatureId],
  questionId: string,
): AnswerRecord {
  return {
    questionInstanceId: questionId,
    questionId,
    selected: "left",
    supportedSignature: route,
    contextTag,
    pair,
  };
}

function uncertain(
  contextTag: string,
  pair: [SignatureId, SignatureId],
  questionId = contextTag,
): AnswerRecord {
  return {
    questionInstanceId: questionId,
    questionId,
    selected: "uncertain",
    supportedSignature: null,
    contextTag,
    pair,
  };
}
