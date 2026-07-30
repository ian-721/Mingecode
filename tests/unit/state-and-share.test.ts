import { describe, expect, it } from "vitest";
import { demoReducer, initialDemoState } from "@/lib/reducer";
import {
  createSharePayload,
  sharePayloadContainsSensitiveFields,
} from "@/lib/share";
import type {
  ChartPrompt,
  ChartResolution,
  DemoState,
  HybridVerdict,
} from "@/lib/types";

const chartPrompt: ChartPrompt = {
  routeOrder: ["SIG-A1", "SIG-A2", "SIG-B1", "SIG-C1"],
  primaryRoute: "SIG-A1",
  cues: [],
  uncertaintyFlags: [],
};

const resolution: ChartResolution = {
  charts: [],
  timeStability: "stable",
  notices: [],
  chartPrompt,
};

describe("state reset and share whitelist", () => {
  it("R2-S02 clears cues, questions, answers and verdict when editing birth data", () => {
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
          pair: ["SIG-A1", "SIG-A2"],
        },
      ],
      verdict: verdict(),
    };
    expect(demoReducer(populated, { type: "edit_birth" })).toEqual(
      initialDemoState,
    );
  });

  it("rebuilds the deterministic route when returning to change an answer", () => {
    let state = resolvedState();
    state = demoReducer(state, { type: "answer", selected: "left" });
    state = demoReducer(state, { type: "answer", selected: "left" });
    expect(state.answers).toHaveLength(2);
    expect(state.questions).toHaveLength(3);
    state = demoReducer(state, { type: "back" });
    expect(state.answers).toHaveLength(1);
    expect(state.questions).toHaveLength(2);
  });

  it("finishes the decisive path after four questions", () => {
    let state = resolvedState();
    for (let index = 0; index < 4; index += 1) {
      state = demoReducer(state, { type: "answer", selected: "left" });
    }

    expect(state.step).toBe("transition");
    expect(state.verdict?.calibration.questionsUsed).toBe(4);
  });

  it("stops an uncertain path at the six-question cap", () => {
    let state = resolvedState();
    for (let index = 0; index < 6; index += 1) {
      state = demoReducer(state, {
        type: "answer",
        selected: "uncertain",
      });
    }

    expect(state.step).toBe("transition");
    expect(state.questions).toHaveLength(6);
    expect(state.verdict?.relationship).toBe("unresolved");
    expect(state.verdict?.calibration.questionsUsed).toBe(6);
  });

  it("R2-S01 share payload uses an explicit public whitelist", () => {
    const payload = createSharePayload(verdict());
    expect(Object.keys(payload).sort()).toEqual(
      ["crash", "invitation", "product", "recognition", "resultName"].sort(),
    );
    expect(sharePayloadContainsSensitiveFields(payload)).toBe(false);
    expect(JSON.stringify(payload)).not.toContain("SIG-");
    expect(JSON.stringify(payload)).not.toContain("routeSupport");
  });
});

function verdict(): HybridVerdict {
  return {
    modelVersion: "m1br-hybrid-r2-0.1",
    chartPrompt,
    calibration: {
      questionIds: ["one", "two", "three", "four"],
      questionsUsed: 4,
      routeSupport: { "SIG-A1": 2, "SIG-A2": 1 },
      uncertainCount: 0,
    },
    reality: {
      primaryRoute: "SIG-A1",
      secondaryRoute: null,
    },
    relationship: "aligned",
  };
}

function resolvedState(): DemoState {
  const started = demoReducer(initialDemoState, {
    type: "resolve_started",
    input: {
      date: "2024-02-10",
      time: "14:30",
      timePrecision: "exact",
      cityId: "beijing",
    },
  });
  return demoReducer(started, {
    type: "resolve_succeeded",
    resolution,
  });
}
