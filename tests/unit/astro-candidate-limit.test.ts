import { describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
  wall: { year: 2001, month: 3, day: 24, hour: 5, minute: 0 },
}));

vi.mock("@4n6h4x0r/stem-branch", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@4n6h4x0r/stem-branch")
  >();
  const fixedPillars = actual.computeFourPillars(
    new Date("2001-03-23T21:00:00.000Z"),
  );

  return {
    ...actual,
    localToUtc: vi.fn(
      (year: number, month: number, day: number, hour: number, minute: number) => {
        mockState.wall = { year, month, day, hour, minute };
        return new Date(Date.UTC(year, month - 1, day, hour, minute));
      },
    ),
    utcToLocal: vi.fn(() => ({ ...mockState.wall })),
    computeFourPillars: vi.fn(() => fixedPillars),
    getSolarTermsForYear: vi.fn(() => []),
  };
});

import * as stemBranch from "@4n6h4x0r/stem-branch";
import { resolveBirthInput } from "@/lib/astro";

describe("chart candidate limit", () => {
  it("accepts more than 16 raw candidates when deduplication leaves at most 16 charts", async () => {
    const result = await resolveBirthInput({
      date: "2001-03-24",
      time: "05:00",
      timePrecision: "approximate",
      cityId: "zhengzhou",
    });

    expect(
      vi.mocked(stemBranch.computeFourPillars).mock.calls.length,
    ).toBeGreaterThan(16);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.charts).toHaveLength(1);
  });
});
