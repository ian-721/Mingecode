import type {
  FourPillars,
  TenRelation,
  getHiddenStems,
  getTenRelation,
} from "@4n6h4x0r/stem-branch";
import type {
  ChartFacts,
  ChartPrompt,
  CueFamily,
  CueState,
  SignatureId,
} from "@/lib/types";

type RelationTools = {
  getHiddenStems: typeof getHiddenStems;
  getTenRelation: typeof getTenRelation;
};

type SingleChartCueState = "visible" | "hidden" | "not_observed";

export const SIGNATURE_ORDER: SignatureId[] = [
  "SIG-A1",
  "SIG-A2",
  "SIG-B1",
  "SIG-C1",
];

export const CUE_FAMILIES: CueFamily[] = [
  "input",
  "output",
  "peer",
  "authority",
  "completion",
];

export const ROUTE_CUES: Record<SignatureId, CueFamily[]> = {
  "SIG-A1": ["input", "output"],
  "SIG-A2": ["output"],
  "SIG-B1": ["peer", "authority"],
  "SIG-C1": ["output", "completion"],
};

const RELATION_FAMILY: Record<TenRelation, CueFamily> = {
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

  return {
    pillars: {
      year: pillars.year,
      month: pillars.month,
      day: pillars.day,
      hour: includeHour ? pillars.hour : null,
    },
    visibleStems,
    hiddenStems,
  };
}

export function createChartPrompt(
  charts: ChartFacts[],
  unknownHour: boolean,
): ChartPrompt {
  const cues = CUE_FAMILIES.map((family) => ({
    family,
    state: aggregateCueState(
      charts.map((chart) => cueStateForChart(chart, family)),
      unknownHour,
    ),
  }));
  const cueByFamily = new Map(cues.map((cue) => [cue.family, cue.state]));
  const routeOrder = [...SIGNATURE_ORDER].sort((left, right) => {
    const leftMatch = promptMatch(left, cueByFamily);
    const rightMatch = promptMatch(right, cueByFamily);
    const leftVisible = stableVisibleCount(left, cueByFamily);
    const rightVisible = stableVisibleCount(right, cueByFamily);
    return (
      rightMatch - leftMatch ||
      rightVisible - leftVisible ||
      SIGNATURE_ORDER.indexOf(left) - SIGNATURE_ORDER.indexOf(right)
    );
  });
  const stableCueCount = cues.filter((cue) =>
    ["stable_visible", "stable_hidden"].includes(cue.state),
  ).length;
  const uncertaintyFlags: ChartPrompt["uncertaintyFlags"] = [];

  if (unknownHour) uncertaintyFlags.push("unknown_hour");
  if (cues.some((cue) => cue.state === "variant")) {
    uncertaintyFlags.push("boundary_variant");
  }
  if (stableCueCount === 0) {
    uncertaintyFlags.push("insufficient_stable_cues");
  }

  return {
    routeOrder,
    primaryRoute: routeOrder[0],
    cues,
    uncertaintyFlags,
  };
}

function cueStateForChart(
  facts: ChartFacts,
  family: CueFamily,
): SingleChartCueState {
  if (
    facts.visibleStems.some(
      (fact) => RELATION_FAMILY[fact.relation] === family,
    )
  ) {
    return "visible";
  }
  if (
    facts.hiddenStems.some(
      (fact) => RELATION_FAMILY[fact.relation] === family,
    )
  ) {
    return "hidden";
  }
  return "not_observed";
}

function aggregateCueState(
  states: SingleChartCueState[],
  unknownHour: boolean,
): CueState {
  if (states.length === 0) return "unknown";
  if (states.every((state) => state === "visible")) {
    return "stable_visible";
  }
  if (states.every((state) => state === "hidden")) {
    return "stable_hidden";
  }
  if (states.every((state) => state === "not_observed")) {
    return unknownHour ? "unknown" : "not_observed";
  }
  return "variant";
}

function promptMatch(
  route: SignatureId,
  cues: Map<CueFamily, CueState>,
): number {
  return ROUTE_CUES[route].filter((family) =>
    ["stable_visible", "stable_hidden"].includes(
      cues.get(family) ?? "unknown",
    ),
  ).length;
}

function stableVisibleCount(
  route: SignatureId,
  cues: Map<CueFamily, CueState>,
): number {
  return ROUTE_CUES[route].filter(
    (family) => cues.get(family) === "stable_visible",
  ).length;
}
