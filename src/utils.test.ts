import { describe, expect, it, vi } from "vitest";
import { compareArrays, getEarliestDate, getLatestDate } from "./utils";
import { IEventDate } from "./store/types";

const makeDates = (...isoDates: string[]): IEventDate[] =>
    isoDates.map((event_date, pk) => ({ pk, event_date, label: "" }));

describe("compareArrays", () => {
    it("returns true for equal arrays regardless of order (with sort)", () => {
        expect(compareArrays([1, 2, 3], [3, 2, 1])).toBe(true);
    });

    it("returns false for different arrays", () => {
        expect(compareArrays([1, 2], [1, 2, 3])).toBe(false);
    });

    it("respects order when sort is disabled", () => {
        expect(compareArrays([1, 2, 3], [3, 2, 1], false)).toBe(false);
        expect(compareArrays([1, 2, 3], [1, 2, 3], false)).toBe(true);
    });

    it("treats empty arrays as equal", () => {
        expect(compareArrays([], [])).toBe(true);
    });
});

describe("getEarliestDate", () => {
    it("returns null for an empty list", () => {
        expect(getEarliestDate([])).toBeNull();
    });

    it("returns the earliest date", () => {
        const result = getEarliestDate(
            makeDates("2025-05-29", "2025-05-27", "2025-05-28")
        );
        expect(result).toEqual(new Date("2025-05-27"));
    });

    it("returns null and warns when input is malformed", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        // @ts-expect-error intentionally invalid input
        expect(getEarliestDate(null)).toBeNull();
        warn.mockRestore();
    });
});

describe("getLatestDate", () => {
    it("returns the latest date", () => {
        const result = getLatestDate(
            makeDates("2025-05-27", "2025-05-29", "2025-05-28")
        );
        expect(result).toEqual(new Date("2025-05-29"));
    });

    it("returns a valid Date (now) for an empty list", () => {
        const result = getLatestDate([]);
        expect(result).toBeInstanceOf(Date);
        expect(Number.isNaN(result.getTime())).toBe(false);
    });
});
