import {
  CONQUERING_CYCLE,
  GENERATIVE_CYCLE,
  STEM_ELEMENT,
  getHiddenStems,
  getStrength,
  getTenRelation,
  type Element,
  type FourPillars,
  type Stem,
  type TenRelation,
} from "@4n6h4x0r/stem-branch";
import { deriveChartFacts } from "@/lib/signatures";
import type { BirthInput, ChartResolution } from "@/lib/types";
import type {
  ChartFacts,
  Occurrence,
  Role,
  SeasonalStrength,
  StaticRuleEngineInput,
} from "./types";

const RELATION_ROLE: Readonly<
  Record<TenRelation, Exclude<Role, "subject">>
> = {
  比肩: "peer",
  劫財: "peer",
  食神: "output",
  傷官: "output",
  正財: "resource",
  偏財: "resource",
  正官: "constraint",
  七殺: "constraint",
  正印: "input",
  偏印: "input",
};

const ADAPTER_ROLES: readonly Role[] = [
  "subject",
  "input",
  "peer",
  "output",
  "resource",
  "constraint",
];

/**
 * Mechanically maps the existing civil-time chart resolution into the v0.5
 * ordinary-runtime input. It deliberately does not read chartPrompt, answers,
 * signatures, expected mechanisms, or any product content.
 */
export function adaptChartResolution(
  birthInput: BirthInput,
  resolution: ChartResolution,
): StaticRuleEngineInput {
  if (resolution.timeConventionVersion !== "civil_time_v1") {
    throw new Error("Content preview only accepts civil_time_v1");
  }
  if (resolution.charts.length === 0) {
    throw new Error("ChartResolution must contain at least one chart");
  }

  const candidateIds = new Set<string>();
  const isExactCivilChart =
    birthInput.timePrecision === "exact" &&
    resolution.charts.length === 1 &&
    resolution.charts[0].convention === "civil";
  const missingPositions =
    birthInput.timePrecision === "unknown"
      ? (["hour.stem", "hour.branch"] as const)
      : [];

  const candidates = resolution.charts.map((chart) => {
    if (!chart.key || candidateIds.has(chart.key)) {
      throw new Error(`Invalid or duplicate chart candidate key: ${chart.key}`);
    }
    candidateIds.add(chart.key);

    return {
      candidateId: chart.key,
      facts: adaptResolvedChartFacts(
        chart.facts,
        isExactCivilChart ? "exact" : "bounded",
        missingPositions,
      ),
    };
  });

  return {
    timeBasisVersion: "civil_time_v1",
    candidates,
  };
}

/** Test-only witness helper. Product runtime always enters through BirthInput. */
export function adaptPillarsToChartFacts(
  pillars: FourPillars,
  precision: ChartFacts["precision"] = "exact",
  missingPositions: readonly string[] = [],
): ChartFacts {
  const resolvedFacts = deriveChartFacts(pillars, true, {
    getHiddenStems,
    getTenRelation,
  });
  return adaptResolvedChartFacts(resolvedFacts, precision, missingPositions);
}

function adaptResolvedChartFacts(
  facts: ChartResolution["charts"][number]["facts"],
  precision: ChartFacts["precision"],
  missingPositions: readonly string[],
): ChartFacts {
  const dayStem = facts.pillars.day.stem;
  const roleElements = deriveRoleElements(dayStem);
  const seasonalStrength = Object.fromEntries(
    ADAPTER_ROLES.map((role) => [
      role,
      getStrength(roleElements[role], facts.pillars.month.branch)
        .label as SeasonalStrength,
    ]),
  ) as Readonly<Record<Role, SeasonalStrength>>;

  const physicalBranchClusters = buildPhysicalBranchClusters(facts);
  const occurrences: Occurrence[] = [
    {
      role: "subject",
      kind: "day_anchor",
      objectKey: `day:day_anchor:0:${dayStem}`,
      originClusterKey: `day-anchor:${dayStem}`,
      hiddenStemProportion: null,
      rootOccurrence: false,
    },
  ];

  for (const visible of facts.visibleStems) {
    occurrences.push({
      role: RELATION_ROLE[visible.relation],
      kind: "visible",
      objectKey: `${visible.position}:visible:0:${visible.stem}`,
      originClusterKey: visibleOriginCluster(
        visible.position,
        visible.stem,
        physicalBranchClusters,
      ),
      hiddenStemProportion: null,
      rootOccurrence: false,
    });
  }

  for (const hidden of facts.hiddenStems) {
    const hiddenList = getHiddenStems(hidden.branch);
    const hiddenIndex = hiddenList.findIndex(
      (item) => item.stem === hidden.stem,
    );
    const hiddenSource = hiddenList[hiddenIndex];
    if (!hiddenSource || hiddenIndex < 0) {
      throw new Error(
        `Missing hidden-stem source for ${hidden.position}:${hidden.branch}:${hidden.stem}`,
      );
    }
    occurrences.push({
      role: RELATION_ROLE[hidden.relation],
      kind: "hidden",
      objectKey: `${hidden.position}:hidden:${hiddenIndex}:${hidden.stem}`,
      originClusterKey: `branch:${hidden.position}:${hidden.branch}`,
      hiddenStemProportion: hiddenSource.proportion,
      rootOccurrence: true,
    });
  }

  return {
    precision,
    missingPositions,
    seasonalStrength,
    occurrences,
  };
}

function deriveRoleElements(
  dayStem: Stem,
): Readonly<Record<Role, Element>> {
  const subject = STEM_ELEMENT[dayStem];
  const input = findCycleSource(GENERATIVE_CYCLE, subject);
  const constraint = findCycleSource(CONQUERING_CYCLE, subject);
  return {
    subject,
    peer: subject,
    input,
    output: GENERATIVE_CYCLE[subject],
    resource: CONQUERING_CYCLE[subject],
    constraint,
  };
}

function findCycleSource(
  cycle: Readonly<Record<Element, Element>>,
  target: Element,
): Element {
  const source = (Object.keys(cycle) as Element[]).find(
    (element) => cycle[element] === target,
  );
  if (!source) throw new Error(`Unable to derive element source for ${target}`);
  return source;
}

type PhysicalBranchCluster = {
  readonly key: string;
  readonly stems: readonly Stem[];
};

function buildPhysicalBranchClusters(
  facts: ChartResolution["charts"][number]["facts"],
): readonly PhysicalBranchCluster[] {
  const pillars = facts.pillars;
  const entries = [
    ["year", pillars.year.branch],
    ["month", pillars.month.branch],
    ["day", pillars.day.branch],
    ...(pillars.hour ? ([['hour', pillars.hour.branch]] as const) : []),
  ] as const;

  return entries.map(([position, branch]) => ({
    key: `branch:${position}:${branch}`,
    stems: getHiddenStems(branch).map((item) => item.stem),
  }));
}

function visibleOriginCluster(
  position: string,
  stem: Stem,
  clusters: readonly PhysicalBranchCluster[],
): string {
  const matching = clusters.filter((cluster) => cluster.stems.includes(stem));
  return matching.length === 1
    ? matching[0].key
    : `visible:${position}:${stem}`;
}
