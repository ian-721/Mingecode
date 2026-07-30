import { getCity } from "@/data/cities";
import {
  createChartPrompt,
  deriveChartFacts,
} from "@/lib/signatures";
import type {
  BirthInput,
  BirthResolutionResult,
  ChartCandidate,
  ChartResolution,
  TimeStability,
} from "@/lib/types";

type StemBranchModule = typeof import("@4n6h4x0r/stem-branch");

type WallTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

type InstantCandidate = {
  instant: Date;
  wall: WallTime;
  convention: ChartCandidate["convention"];
};

export async function resolveBirthInput(
  input: BirthInput,
): Promise<BirthResolutionResult> {
  const city = getCity(input.cityId);
  const wall = parseBirthInput(input);
  if (!city || !wall) return { ok: false, error: "invalid_input" };

  try {
    const stemBranch = await import("@4n6h4x0r/stem-branch");
    const baseWalls = buildBaseWallCandidates(wall, input.timePrecision);
    const instantCandidates: InstantCandidate[] = [];

    for (const item of baseWalls) {
      const instants = resolveWallInstantsWithModule(
        item.wall,
        city.timezoneId,
        stemBranch,
      );
      if (instants.length === 0 && input.timePrecision === "exact") {
        return { ok: false, error: "nonexistent_local_time" };
      }
      for (const instant of instants) {
        instantCandidates.push({
          instant,
          wall: item.wall,
          convention: item.convention,
        });
      }
    }

    if (input.timePrecision !== "unknown") {
      addHourBoundaryCandidates(
        instantCandidates,
        city.timezoneId,
        stemBranch,
      );
      addZiHourCandidate(instantCandidates);
      addSolarTermCandidates(
        instantCandidates,
        city.timezoneId,
        stemBranch,
      );
    }

    if (instantCandidates.length > 16) {
      return { ok: false, error: "too_many_candidates" };
    }

    const includeHour = input.timePrecision !== "unknown";

    const chartMap = new Map<string, ChartCandidate>();
    for (const item of instantCandidates) {
      const civilDate = asCivilDate(item.instant, item.wall);
      const pillars = stemBranch.computeFourPillars(civilDate);
      const key = [
        pillars.year,
        pillars.month,
        pillars.day,
        includeHour ? pillars.hour : null,
      ]
        .map((pillar) =>
          pillar ? `${pillar.stem}${pillar.branch}` : "unknown-hour",
        )
        .join("|");
      if (chartMap.has(key)) continue;
      chartMap.set(key, {
        key,
        convention: item.convention,
        facts: deriveChartFacts(
          pillars,
          includeHour,
          stemBranch,
        ),
      });
    }

    const charts = [...chartMap.values()];
    if (charts.length === 0) {
      return { ok: false, error: "calculation_failed" };
    }

    const chartPrompt = createChartPrompt(
      charts.map((chart) => chart.facts),
      input.timePrecision === "unknown",
    );
    const timeStability = deriveFinalStability(
      input.timePrecision,
      chartPrompt.uncertaintyFlags,
    );

    const value: ChartResolution = {
      charts,
      chartPrompt,
      timeStability,
      notices: buildNotices(input, timeStability, charts.length),
    };
    return { ok: true, value };
  } catch {
    return { ok: false, error: "calculation_failed" };
  }
}

export async function resolveWallInstants(
  wall: WallTime,
  timezoneId: string,
): Promise<Date[]> {
  const stemBranch = await import("@4n6h4x0r/stem-branch");
  return resolveWallInstantsWithModule(wall, timezoneId, stemBranch);
}

function resolveWallInstantsWithModule(
  wall: WallTime,
  timezoneId: string,
  stemBranch: StemBranchModule,
): Date[] {
  const primary = stemBranch.localToUtc(
    wall.year,
    wall.month,
    wall.day,
    wall.hour,
    wall.minute,
    timezoneId,
  );
  const matches = new Map<number, Date>();

  for (let delta = -180; delta <= 180; delta += 30) {
    const instant = new Date(primary.getTime() + delta * 60_000);
    const local = stemBranch.utcToLocal(instant, timezoneId);
    if (
      local.year === wall.year &&
      local.month === wall.month &&
      local.day === wall.day &&
      local.hour === wall.hour &&
      local.minute === wall.minute
    ) {
      matches.set(instant.getTime(), instant);
    }
  }

  return [...matches.values()].sort((a, b) => a.getTime() - b.getTime());
}

function parseBirthInput(input: BirthInput): WallTime | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.date);
  if (!dateMatch) return null;
  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const [hour, minute] =
    input.timePrecision === "unknown"
      ? [12, 0]
      : (input.time ?? "").split(":").map(Number);

  if (
    year < 1900 ||
    year > new Date().getUTCFullYear() ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const dateValue = Date.UTC(year, month - 1, day);
  const date = new Date(dateValue);
  const now = new Date();
  const todayValue = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day ||
    dateValue > todayValue
  ) {
    return null;
  }
  return { year, month, day, hour, minute };
}

function buildBaseWallCandidates(
  wall: WallTime,
  precision: BirthInput["timePrecision"],
): Array<{
  wall: WallTime;
  convention: ChartCandidate["convention"];
}> {
  if (precision === "unknown") {
    return [{ wall: { ...wall, hour: 12, minute: 0 }, convention: "unknown_time" }];
  }
  if (precision === "approximate") {
    return [-60, 0, 60].map((delta) => ({
      wall: addWallMinutes(wall, delta),
      convention: "approximate_time" as const,
    }));
  }
  return [{ wall, convention: "civil" }];
}

function addHourBoundaryCandidates(
  candidates: InstantCandidate[],
  timezoneId: string,
  stemBranch: StemBranchModule,
): void {
  const originals = [...candidates];
  for (const item of originals) {
    const boundary = nearestHourBoundary(item.wall);
    if (!boundary || boundary.distance > 30) continue;
    const delta =
      boundary.signedDistance >= 0
        ? boundary.signedDistance + 1
        : boundary.signedDistance - 1;
    const wall = addWallMinutes(item.wall, delta);
    for (const instant of resolveWallInstantsWithModule(
      wall,
      timezoneId,
      stemBranch,
    )) {
      candidates.push({ instant, wall, convention: "hour_boundary" });
    }
  }
}

function addZiHourCandidate(candidates: InstantCandidate[]): void {
  const originals = [...candidates];
  for (const item of originals) {
    if (item.wall.hour !== 23) continue;
    const nextDay = addWallMinutes(item.wall, 60);
    candidates.push({
      instant: item.instant,
      wall: { ...nextDay, hour: 0, minute: item.wall.minute },
      convention: "zi_hour_day_rollover",
    });
  }
}

function addSolarTermCandidates(
  candidates: InstantCandidate[],
  timezoneId: string,
  stemBranch: StemBranchModule,
): void {
  const originals = [...candidates];
  for (const item of originals) {
    const terms = [
      ...stemBranch.getSolarTermsForYear(item.wall.year - 1),
      ...stemBranch.getSolarTermsForYear(item.wall.year),
      ...stemBranch.getSolarTermsForYear(item.wall.year + 1),
    ];
    const closest = terms
      .map((term) => ({
        term,
        distance: Math.abs(term.date.getTime() - item.instant.getTime()),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (!closest || closest.distance > 120 * 60_000) continue;

    for (const direction of [-1, 1]) {
      const instant = new Date(closest.term.date.getTime() + direction * 60_000);
      const local = stemBranch.utcToLocal(instant, timezoneId);
      candidates.push({
        instant,
        wall: {
          year: local.year,
          month: local.month,
          day: local.day,
          hour: local.hour,
          minute: local.minute,
        },
        convention: "solar_term_boundary",
      });
    }
  }
}

export function isWithinHourBoundary(
  hour: number,
  minute: number,
  threshold = 30,
): boolean {
  return (nearestHourBoundary({ year: 2000, month: 1, day: 1, hour, minute })
    ?.distance ?? Infinity) <= threshold;
}

function nearestHourBoundary(wall: WallTime):
  | { distance: number; signedDistance: number }
  | undefined {
  const current = wall.hour * 60 + wall.minute;
  const boundaries = [-60, 60, 180, 300, 420, 540, 660, 780, 900, 1020, 1140, 1260, 1380, 1500];
  return boundaries
    .map((boundary) => ({
      distance: Math.abs(boundary - current),
      signedDistance: boundary - current,
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

export function isWithinSolarBoundary(
  instant: Date,
  boundary: Date,
  thresholdMinutes = 120,
): boolean {
  return (
    Math.abs(instant.getTime() - boundary.getTime()) <=
    thresholdMinutes * 60_000
  );
}

function addWallMinutes(wall: WallTime, minutes: number): WallTime {
  const value = new Date(
    Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute) +
      minutes * 60_000,
  );
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: value.getUTCDate(),
    hour: value.getUTCHours(),
    minute: value.getUTCMinutes(),
  };
}

function asCivilDate(instant: Date, wall: WallTime): Date {
  const date = new Date(instant.getTime());
  Object.defineProperties(date, {
    getFullYear: { value: () => wall.year },
    getMonth: { value: () => wall.month - 1 },
    getDate: { value: () => wall.day },
    getHours: { value: () => wall.hour },
    getMinutes: { value: () => wall.minute },
  });
  return date;
}

function deriveFinalStability(
  precision: BirthInput["timePrecision"],
  uncertaintyFlags: ChartResolution["chartPrompt"]["uncertaintyFlags"],
): TimeStability {
  if (precision === "unknown") return "insufficient";
  return uncertaintyFlags.includes("boundary_variant")
    ? "boundary_sensitive"
    : "stable";
}

function buildNotices(
  input: BirthInput,
  stability: TimeStability,
  chartCount: number,
): string[] {
  const notices: string[] = [];
  if (input.timePrecision === "unknown") {
    notices.push("出生时间不清楚，本次不会假装知道时柱。");
  } else if (input.timePrecision === "approximate") {
    notices.push("按约数时间保留了相邻可能，不强行装成分秒不差。");
  }
  if (stability === "boundary_sensitive") {
    notices.push("这段时间靠近边界，结果会保留一点余地。");
  }
  if (chartCount > 1) {
    notices.push(`后台保留了 ${chartCount} 个合理版本，前台只呈现共同部分。`);
  }
  return notices;
}
