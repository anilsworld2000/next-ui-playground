import { describe, expect, it } from "vitest";
import {
    defaultRetirementStressTestValues,
    prepareRetirementStressTest,
    validateRetirementStressTestForm,
} from "./retirementStressTestModel";

describe("Retirement Stress Test model", () => {
    it("uses the retirement corpus defaults and prepares matching required SIP assumptions", () => {
        expect(defaultRetirementStressTestValues).toMatchObject({
            monthlyExpense: "100000",
            expenseMultiplier: "16.8",
            yearsToRetirement: "22",
            drawdownYears: "26",
            nominalReturnPercent: "12",
            inflationPercent: "8",
            taxHaircutPercent: "6",
            currentCorpus: "0",
            stepUpRatePercent: "10",
            volatilityPercent: "18",
            simulationCount: "2000",
        });

        const prepared = prepareRetirementStressTest(defaultRetirementStressTestValues);

        expect(prepared.status).toBe("success");
        if (prepared.status !== "success") {
            throw new Error(prepared.message);
        }

        expect(prepared.prepared.iterations).toBe(2000);
        expect(prepared.prepared.params.monthlyAmount).toBeGreaterThan(0);
        expect(prepared.prepared.params.existingCorpus).toBe(0);
        expect(prepared.prepared.params.stdDevReturn).toBe(0.18);
        expect(prepared.prepared.params.firstYearAnnualWithdrawal)
            .toBeCloseTo(100000 * 16.8 * Math.pow(1.08, 22));
        expect(prepared.prepared.targetCorpus).toBeCloseTo(148548127.32, 2);
    });

    it("validates whole-year durations, volatility, and supported simulation counts", () => {
        const errors = validateRetirementStressTestForm({
            ...defaultRetirementStressTestValues,
            yearsToRetirement: "2.5",
            volatilityPercent: "101",
            simulationCount: "10001",
        });

        expect(errors.yearsToRetirement).toContain("whole number");
        expect(errors.volatilityPercent).toContain("between 0% and 100%");
        expect(errors.simulationCount).toContain("500 and 10,000");
    });

    it("rejects combined simulation durations longer than 1,000 years", () => {
        const errors = validateRetirementStressTestForm({
            ...defaultRetirementStressTestValues,
            yearsToRetirement: "975",
            drawdownYears: "26",
        });

        expect(errors.drawdownYears).toContain("cannot exceed 1000 years");
    });

    it("bounds worker result size without lowering the selectable 10,000 simulation option", () => {
        expect(validateRetirementStressTestForm({
            ...defaultRetirementStressTestValues,
            simulationCount: "10000",
            yearsToRetirement: "175",
            drawdownYears: "26",
        }).simulationCount).toContain("exceed the supported workload");
        expect(validateRetirementStressTestForm({
            ...defaultRetirementStressTestValues,
            simulationCount: "10000",
            yearsToRetirement: "174",
            drawdownYears: "26",
        })).toEqual({});
    });

    it("requires a finite step-up SIP for a positive shortfall", () => {
        const prepared = prepareRetirementStressTest({
            ...defaultRetirementStressTestValues,
            nominalReturnPercent: "0",
            inflationPercent: "2",
        });

        expect(prepared).toEqual({
            status: "error",
            message: "A non-zero expected return is required to calculate a step-up SIP.",
        });
    });

    it("allows a zero SIP when current savings already cover the target", () => {
        const prepared = prepareRetirementStressTest({
            ...defaultRetirementStressTestValues,
            currentCorpus: "200000000",
        });

        expect(prepared.status).toBe("success");
        if (prepared.status === "success") {
            expect(prepared.prepared.requiredMonthlySIP).toBe(0);
        }
    });
});
