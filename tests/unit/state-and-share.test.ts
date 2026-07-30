import { describe, expect, it } from "vitest";
import { demoReducer, initialDemoState } from "@/lib/reducer";
import {
  createSharePayload,
  sharePayloadContainsSensitiveFields,
} from "@/lib/share";
import type {
  CalibrationVerdict,
  ChartResolution,
  DemoState,
} from "@/lib/types";

const resolution: ChartResolution = {
  charts: [],
  timeStability: "stable",
  notices: [],
  candidates: [
    {
      id: "SIG-A1",
      rank: 1,
      level: "supported",
      routeComplete: true,
      uncertaintyCount: 0,
      stableAcrossCharts: true,
      evidenceClusters: ["input-output"],
    },
    {
      id: "SIG-B1",
      rank: 2,
      level: "candidate",
      routeComplete: true,
      uncertaintyCount: 1,
      stableAcrossCharts: true,
      evidenceClusters: ["peer-authority"],
    },
  ],
};

describe("state reset and share whitelist", () => {
  it("clears old candidates and answers when editing birth data", () => {
    const populated: DemoState = {
      ...initialDemoState,
      step: "result",
      chartResolution: resolution,
      questions: [],
      answers: [
        {
          questionInstanceId: "one",
          questionId: "one",
          selected: "left",
          supportedSignature: "SIG-A1",
          contextTag: "daily",
        },
      ],
      verdict: {
        relation: "aligned",
        chartRoute: "SIG-A1",
        realityRoutes: ["SIG-A1"],
        answerCount: 3,
      },
    };
    expect(demoReducer(populated, { type: "edit_birth" })).toEqual(
      initialDemoState,
    );
  });

  it("rebuilds the question route when returning to change an answer", () => {
    let state = demoReducer(initialDemoState, {
      type: "resolve_started",
      input: {
        date: "2024-02-10",
        time: "14:30",
        timePrecision: "exact",
        cityId: "beijing",
      },
    });
    state = demoReducer(state, {
      type: "resolve_succeeded",
      resolution,
    });
    state = demoReducer(state, { type: "answer", selected: "left" });
    state = demoReducer(state, { type: "answer", selected: "left" });
    expect(state.answers).toHaveLength(2);
    expect(state.questions).toHaveLength(3);
    state = demoReducer(state, { type: "back" });
    expect(state.answers).toHaveLength(1);
    expect(state.questions).toHaveLength(2);
  });

  it("share payload uses an explicit public whitelist", () => {
    const verdict: CalibrationVerdict = {
      relation: "aligned",
      chartRoute: "SIG-A1",
      realityRoutes: ["SIG-A1"],
      answerCount: 3,
    };
    const payload = createSharePayload(verdict);
    expect(Object.keys(payload).sort()).toEqual(
      ["crash", "invitation", "product", "recognition", "resultName"].sort(),
    );
    expect(sharePayloadContainsSensitiveFields(payload)).toBe(false);
    expect(JSON.stringify(payload)).not.toContain("SIG-");
  });
});
