import { describe, expect, it } from "vitest";
import { formatCompactCurrency, formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
    it("uses Indian digit grouping and INR currency formatting", () => {
        expect(formatCurrency(14854812)).toBe("₹1,48,54,812");
    });

    it("rounds to whole rupees", () => {
        expect(formatCurrency(1234.56)).toBe("₹1,235");
    });

    it("formats chart-axis values compactly using Indian grouping", () => {
        expect(formatCompactCurrency(14854812)).toBe("₹1.5Cr");
    });
});