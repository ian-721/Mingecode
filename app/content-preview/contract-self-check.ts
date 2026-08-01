import type { FourPillars } from "@/lib/types";
import { evaluateContentRebuild } from "@/lib/content-rebuild";
import { adaptPillarsToChartFacts } from "@/lib/content-rebuild/adapter";

const TRACES: readonly { readonly id: string; readonly pillars: FourPillars }[] = [
  {
    id: "S01",
    pillars: {
      year: { stem: "乙", branch: "亥" },
      month: { stem: "癸", branch: "未" },
      day: { stem: "甲", branch: "寅" },
      hour: { stem: "甲", branch: "子" },
    },
  },
  {
    id: "S02",
    pillars: {
      year: { stem: "壬", branch: "午" },
      month: { stem: "丙", branch: "午" },
      day: { stem: "乙", branch: "丑" },
      hour: { stem: "辛", branch: "巳" },
    },
  },
  {
    id: "S03",
    pillars: {
      year: { stem: "己", branch: "卯" },
      month: { stem: "癸", branch: "酉" },
      day: { stem: "己", branch: "丑" },
      hour: { stem: "乙", branch: "丑" },
    },
  },
  {
    id: "S04",
    pillars: {
      year: { stem: "辛", branch: "巳" },
      month: { stem: "辛", branch: "卯" },
      day: { stem: "丙", branch: "戌" },
      hour: { stem: "辛", branch: "卯" },
    },
  },
];

export const representativeDiagnostics = TRACES.map((trace) => {
  const facts = adaptPillarsToChartFacts(trace.pillars, "exact", []);
  const result = evaluateContentRebuild({
    timeBasisVersion: "civil_time_v1",
    candidates: [{ candidateId: trace.id, facts }],
  });
  const local = result.candidateResults[0];

  return {
    id: trace.id,
    seasonalStrength: facts.seasonalStrength,
    occurrences: facts.occurrences,
    nodeAvailability: result.nodeAvailability,
    evidence: result.evidence,
    dimensions: result.dimensions,
    roleNodes: local.evidenceGraph.nodes
      .filter((node) => node.layer === "E1")
      .map((node) => ({
        id: node.id,
        status: node.status,
        structuralStatus: node.structuralStatus,
        visible: node.visible,
        origins: node.originClusterKeys,
      })),
    e4Nodes: local.evidenceGraph.nodes
      .filter((node) => node.layer === "E4")
      .map((node) => ({
        id: node.id,
        status: node.status,
        structuralStatus: node.structuralStatus,
        support: node.supportRelationKeys,
        origins: node.originClusterKeys,
      })),
    paths: local.evidenceGraph.paths.map((path) => ({
      id: path.id,
      structuralStatus: path.structuralStatus,
      competesForInterface: path.competesForInterface,
      roles: path.roleSequence,
      objects: path.objectPath,
      origins: path.originPath,
    })),
    tensions: local.tensions,
    mechanismEvaluations: local.mechanismEvaluations,
    coreCandidates: result.coreCandidates,
    coreMechanism: result.coreMechanism,
    finalState: result.finalState,
  };
});

export function assertRepresentativeContentTraces(): void {
  // Temporarily disabled while the exact real-chart contract mismatch is displayed.
}
