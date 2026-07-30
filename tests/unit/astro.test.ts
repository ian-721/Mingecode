import { describe, expect, it } from "vitest";
import {
  isWithinHourBoundary,
  isWithinSolarBoundary,
  resolveBirthInput,
  resolveWallInstants,
} from "@/lib/astro";

describe("time and pillar fixtures T01-T08", () => {
  it("T01 computes the Beijing reference pillars", async () => {
    const result = await resolveBirthInput({
      date: "2024-02-10",
      time: "14:30",
      timePrecision: "exact",
      cityId: "beijing",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.charts.map((chart) => chart.key)).toContain(
      "甲辰|丙寅|甲辰|辛未",
    );
  });

  it("T02 preserves both zi-hour day conventions", async () => {
    const result = await resolveBirthInput({
      date: "1995-07-21",
      time: "23:40",
      timePrecision: "exact",
      cityId: "jinan",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const keys = result.value.charts.map((chart) => chart.key);
    expect(keys.some((key) => key.includes("|癸丑|甲子"))).toBe(true);
    expect(keys.some((key) => key.includes("|甲寅|甲子"))).toBe(true);
  });

  it("T03 applies historical China DST", async () => {
    const instants = await resolveWallInstants(
      { year: 1988, month: 7, day: 15, hour: 12, minute: 0 },
      "Asia/Shanghai",
    );
    expect(instants).toHaveLength(1);
    expect(instants[0].toISOString()).toBe("1988-07-15T03:00:00.000Z");
  });

  it("T04 blocks a nonexistent New York local time", async () => {
    const result = await resolveBirthInput({
      date: "2024-03-10",
      time: "02:30",
      timePrecision: "exact",
      cityId: "new-york",
    });
    expect(result).toEqual({ ok: false, error: "nonexistent_local_time" });
  });

  it("T05 keeps both instants for a repeated New York time", async () => {
    const instants = await resolveWallInstants(
      { year: 2024, month: 11, day: 3, hour: 1, minute: 30 },
      "America/New_York",
    );
    expect(instants.map((instant) => instant.toISOString())).toEqual([
      "2024-11-03T05:30:00.000Z",
      "2024-11-03T06:30:00.000Z",
    ]);
  });

  it("T06 distinguishes 29 and 31 minutes from an hour boundary", () => {
    expect(isWithinHourBoundary(0, 31)).toBe(true);
    expect(isWithinHourBoundary(0, 29)).toBe(false);
  });

  it("T07 distinguishes 119 and 121 minutes from a solar boundary", () => {
    const boundary = new Date("2026-02-04T00:00:00.000Z");
    expect(
      isWithinSolarBoundary(
        new Date(boundary.getTime() + 119 * 60_000),
        boundary,
      ),
    ).toBe(true);
    expect(
      isWithinSolarBoundary(
        new Date(boundary.getTime() + 121 * 60_000),
        boundary,
      ),
    ).toBe(false);
  });

  it("T08 keeps approximate candidates and does not invent an exact hour", async () => {
    const approximate = await resolveBirthInput({
      date: "2001-03-24",
      time: "05:00",
      timePrecision: "approximate",
      cityId: "zhengzhou",
    });
    expect(approximate.ok).toBe(true);
    if (approximate.ok) {
      expect(approximate.value.charts.length).toBeGreaterThan(0);
      expect(
        approximate.value.notices.some((notice) => notice.includes("约数")),
      ).toBe(true);
    }

    const unknown = await resolveBirthInput({
      date: "2001-03-24",
      time: null,
      timePrecision: "unknown",
      cityId: "zhengzhou",
    });
    expect(unknown.ok).toBe(true);
    if (unknown.ok) {
      expect(unknown.value.timeStability).toBe("insufficient");
      expect(unknown.value.charts[0].facts.pillars.hour).toBeNull();
      expect(
        unknown.value.chartPrompt.cues.find(
          (cue) => cue.family === "authority",
        )?.state,
      ).toBe("unknown");
      expect(
        unknown.value.notices.some((notice) => notice.includes("不会假装")),
      ).toBe(true);
    }
  });

  it("T09 marks repeated instants stable when their aggregated cues are identical", async () => {
    const result = await resolveBirthInput({
      date: "2024-11-03",
      time: "01:30",
      timePrecision: "exact",
      cityId: "new-york",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.timeStability).toBe("stable");
    expect(
      result.value.chartPrompt.uncertaintyFlags,
    ).not.toContain("boundary_variant");
  });
});
