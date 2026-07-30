import type {
  FourPillars,
  TenRelation,
  getHiddenStems,
  getTenRelation,
} from "@4n6h4x0r/stem-branch";
import type {
  ChartFacts,
  NodeState,
  RelationNode,
  SignatureAssessment,
  SignatureCandidate,
  SignatureId,
  SignatureLevel,
  TimeStability,
} from "@/lib/types";

type RelationTools = {
  getHiddenStems: typeof getHiddenStems;
  getTenRelation: typeof getTenRelation;
};

const SIGNATURE_ORDER: SignatureId[] = [
  "SIG-A1",
  "SIG-A2",
  "SIG-B1",
  "SIG-C1",
];

const RELATION_NODE: Record<TenRelation, RelationNode> = {
  正印: "input",
  偏印: "input",
  食神: "output",
  傷官: "output",
  比肩: "peer",
  劫財: "peer",
  正官: "authority",
  七殺: "authority",
  正財: "completion",
  偏財: "completion",
};

export function deriveChartFacts(
  pillars: FourPillars,
  includeHour: boolean,
  timeStability: TimeStability,
  tools: RelationTools,
): ChartFacts {
  const positions = includeHour
    ? (["year", "month", "hour"] as const)
    : (["year", "month"] as const);
  const branchPositions = includeHour
    ? (["year", "month", "day", "hour"] as const)
    : (["year", "month", "day"] as const);

  const visibleStems = positions.map((position) => ({
    position,
    stem: pillars[position].stem,
    relation: tools.getTenRelation(pillars.day.stem, pillars[position].stem),
  }));

  const hiddenStems = branchPositions.flatMap((position) => {
    const branch = pillars[position].branch;
    return tools.getHiddenStems(branch).map((hidden, index) => ({
      position,
      branch,
      stem: hidden.stem,
      relation: tools.getTenRelation(pillars.day.stem, hidden.stem),
      isMain: index === 0,
    }));
  });

  const nodes = {} as Record<RelationNode, NodeState>;
  const nodeNames: RelationNode[] = [
    "input",
    "output",
    "peer",
    "authority",
    "completion",
  ];

  for (const node of nodeNames) {
    const visible = visibleStems.filter(
      (fact) => RELATION_NODE[fact.relation] === node,
    ).length;
    const roots = hiddenStems.filter(
      (fact) => RELATION_NODE[fact.relation] === node,
    );
    const monthMain = roots.some(
      (fact) => fact.position === "month" && fact.isMain,
    );

    if ((visible > 0 && roots.length > 0) || monthMain || roots.length >= 2) {
      nodes[node] = "established";
    } else if (visible > 0 || roots.length > 0) {
      nodes[node] = "present";
    } else {
      nodes[node] = "absent";
    }
  }

  const establishedCount = Object.values(nodes).filter(
    (state) => state === "established",
  ).length;
  const uncertaintyCount =
    Object.values(nodes).filter((state) => state === "present").length +
    (timeStability === "stable" ? 0 : 1);

  return {
    pillars,
    visibleStems,
    hiddenStems,
    nodes,
    capacity:
      establishedCount >= 3
        ? "supported"
        : establishedCount >= 1
          ? "candidate"
          : "fragile",
    timeStability,
    uncertaintyCount,
  };
}

export function assessSignatures(facts: ChartFacts): SignatureAssessment[] {
  const outputVisible = facts.visibleStems.some((fact) =>
    ["食神", "傷官"].includes(fact.relation),
  );
  const unstable = facts.timeStability !== "stable";

  return [
    assessment(
      "SIG-A1",
      facts.nodes.input,
      facts.nodes.output,
      unstable,
      ["input-output"],
    ),
    singleNodeAssessment(
      "SIG-A2",
      facts.nodes.output,
      outputVisible,
      unstable,
      ["input-output"],
    ),
    assessment(
      "SIG-B1",
      facts.nodes.peer,
      facts.nodes.authority,
      unstable,
      ["peer-authority"],
    ),
    assessment(
      "SIG-C1",
      facts.nodes.output,
      facts.nodes.completion,
      unstable,
      ["output-completion"],
    ),
  ];
}

function assessment(
  id: SignatureId,
  left: NodeState,
  right: NodeState,
  unstable: boolean,
  evidenceClusters: string[],
): SignatureAssessment {
  const level: SignatureLevel =
    left === "absent" || right === "absent"
      ? "closed"
      : left === "established" && right === "established" && !unstable
        ? "supported"
        : "candidate";

  return {
    id,
    level,
    routeComplete: left !== "absent" && right !== "absent",
    uncertaintyCount:
      Number(left === "present") + Number(right === "present") + Number(unstable),
    stableAcrossCharts: true,
    evidenceClusters,
  };
}

function singleNodeAssessment(
  id: SignatureId,
  node: NodeState,
  publiclyVisible: boolean,
  unstable: boolean,
  evidenceClusters: string[],
): SignatureAssessment {
  const level: SignatureLevel =
    node === "absent"
      ? "closed"
      : node === "established" && publiclyVisible && !unstable
        ? "supported"
        : "candidate";

  return {
    id,
    level,
    routeComplete: node !== "absent",
    uncertaintyCount:
      Number(node === "present") + Number(!publiclyVisible) + Number(unstable),
    stableAcrossCharts: true,
    evidenceClusters,
  };
}

export function aggregateAndRankSignatures(
  chartAssessments: SignatureAssessment[][],
): SignatureCandidate[] {
  if (chartAssessments.length === 0) return [];

  const aggregate = SIGNATURE_ORDER.map((id) => {
    const items = chartAssessments.map(
      (assessments) => assessments.find((item) => item.id === id)!,
    );
    const levels = items.map((item) => item.level);
    const stableAcrossCharts = levels.every((level) => level === levels[0]);
    const level: SignatureLevel = levels.every((value) => value === "closed")
      ? "closed"
      : levels.every((value) => value === "supported")
        ? "supported"
        : "candidate";

    return {
      id,
      level,
      routeComplete: items.every((item) => item.routeComplete),
      uncertaintyCount: Math.max(
        ...items.map((item) => item.uncertaintyCount),
      ),
      stableAcrossCharts,
      evidenceClusters: [...new Set(items.flatMap((item) => item.evidenceClusters))],
    };
  });

  return aggregate
    .filter((item) => item.level !== "closed")
    .sort(compareSignature)
    .slice(0, 3)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function compareSignature(
  left: SignatureAssessment,
  right: SignatureAssessment,
): number {
  const levelRank = { supported: 0, candidate: 1, closed: 2 };
  return (
    levelRank[left.level] - levelRank[right.level] ||
    Number(right.stableAcrossCharts) - Number(left.stableAcrossCharts) ||
    Number(right.routeComplete) - Number(left.routeComplete) ||
    left.uncertaintyCount - right.uncertaintyCount ||
    SIGNATURE_ORDER.indexOf(left.id) - SIGNATURE_ORDER.indexOf(right.id)
  );
}

export function countUniqueEvidenceClusters(
  assessments: SignatureAssessment[],
): number {
  return new Set(assessments.flatMap((item) => item.evidenceClusters)).size;
}
