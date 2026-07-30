import { describe, expect, it } from "vitest";
import {
  assessSignatures,
  countUniqueEvidenceClusters,
} from "@/lib/signatures";
import type {
  ChartFacts,
  NodeState,
  RelationNode,
} from "@/lib/types";

const baseNodes: Record<RelationNode, NodeState> = {
  input: "absent",
  output: "absent",
  peer: "absent",
  authority: "absent",
  completion: "absent",
};

function facts(
  nodes: Partial<Record<RelationNode, NodeState>>,
  options: { outputVisible?: boolean; unstable?: boolean } = {},
): ChartFacts {
  return {
    pillars: {
      year: { stem: "甲", branch: "子" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "戊", branch: "辰" },
      hour: { stem: "庚", branch: "午" },
    },
    visibleStems: options.outputVisible
      ? [{ position: "year", stem: "庚", relation: "食神" }]
      : [],
    hiddenStems: [],
    nodes: { ...baseNodes, ...nodes },
    capacity: "supported",
    timeStability: options.unstable ? "boundary_sensitive" : "stable",
    uncertaintyCount: 0,
  };
}

describe("signature fixtures S09-S17", () => {
  it("S09 supports A1 when input and output are established", () => {
    const result = assessSignatures(
      facts({ input: "established", output: "established" }),
    );
    expect(result.find((item) => item.id === "SIG-A1")?.level).toBe(
      "supported",
    );
  });

  it("S10 closes A1 when output is absent", () => {
    const result = assessSignatures(
      facts({ input: "established", output: "absent" }),
    );
    expect(result.find((item) => item.id === "SIG-A1")?.level).toBe("closed");
  });

  it("S11 supports A2 when established output is visible", () => {
    const result = assessSignatures(
      facts({ output: "established" }, { outputVisible: true }),
    );
    expect(result.find((item) => item.id === "SIG-A2")?.level).toBe(
      "supported",
    );
  });

  it("S12 keeps hidden-only output as an A2 candidate", () => {
    const result = assessSignatures(facts({ output: "present" }));
    expect(result.find((item) => item.id === "SIG-A2")?.level).toBe(
      "candidate",
    );
  });

  it("S13 supports B1 with both established endpoints", () => {
    const result = assessSignatures(
      facts({ peer: "established", authority: "established" }),
    );
    expect(result.find((item) => item.id === "SIG-B1")?.level).toBe(
      "supported",
    );
  });

  it("S14 downgrades B1 when one endpoint is unresolved", () => {
    const result = assessSignatures(
      facts({ peer: "established", authority: "present" }),
    );
    expect(result.find((item) => item.id === "SIG-B1")?.level).toBe(
      "candidate",
    );
  });

  it("S15 supports C1 with output and completion established", () => {
    const result = assessSignatures(
      facts({ output: "established", completion: "established" }),
    );
    expect(result.find((item) => item.id === "SIG-C1")?.level).toBe(
      "supported",
    );
  });

  it("S16 downgrades C1 under unresolved load", () => {
    const result = assessSignatures(
      facts(
        { output: "established", completion: "established" },
        { unstable: true },
      ),
    );
    expect(result.find((item) => item.id === "SIG-C1")?.level).toBe(
      "candidate",
    );
  });

  it("S17 de-duplicates the shared A1/A2 evidence cluster", () => {
    const result = assessSignatures(
      facts(
        { input: "established", output: "established" },
        { outputVisible: true },
      ),
    ).filter((item) => item.id === "SIG-A1" || item.id === "SIG-A2");
    expect(result.every((item) => item.level === "supported")).toBe(true);
    expect(countUniqueEvidenceClusters(result)).toBe(1);
  });
});
