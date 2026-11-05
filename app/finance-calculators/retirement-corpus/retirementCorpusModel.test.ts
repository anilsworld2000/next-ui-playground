import { describe, expect, it } from "vitest";
import {
    calculateRetirementCorpus,
    defaultRetirementCorpusValues,
    getRetirementCorpusChartData,
    validateRetirementCorpusForm,
} from "./retirementCorpusModel";

describe("Retirement Corpus form model", () => {
    it("uses the confirmed example assumptions and calculates all corpus methodologies", () => {
        const result = calculateRetirementCorpus(defaultRetirementCorpusValues);

        expect(result?.annualExpenseAtRetirement).toBeCloseTo(9133387.8931, 3);
        expect(result?.fixedDurationCorpus.value).toBeCloseTo(148548127.32, 2);
        expect(result?.swrPerpetualCorpus.value).toBeCloseTo(304446263.1, 0);
        expect(result?.realReturnPerpetualCorpus.value).toBeCloseTo(246601473.1, 0);
    });

    it("maps all available corpus methods to comparable chart values", () => {
        const calculation = calculateRetirementCorpus(defaultRetirementCorpusValues);
        expect(calculation).not.toBeNull();

        const chartData = getRetirementCorpusChartData(calculation!);

        expect(chartData.available).toEqual([
            { method: "fixed-duration", label: "Fixed Duration", value: calculation!.fixedDurationCorpus.value },
            { method: "swr-perpetual", label: "SWR Perpetual", value: calculation!.swrPerpetualCorpus.value },
            { method: "real-return-perpetual", label: "Real Return Perpetual", value: calculation!.realReturnPerpetualCorpus.value },
        ]);
        expect(chartData.unavailable).toEqual([]);
    });

    it("omits unavailable alternatives and preserves their reasons for the chart legend", () => {
        const calculation = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            safeWithdrawalRatePercent: "0",
        });
        expect(calculation).not.toBeNull();

        const chartData = getRetirementCorpusChartData(calculation!);

        expect(chartData.available.map(({ method }) => method)).toEqual([
            "fixed-duration",
            "real-return-perpetual",
        ]);
        expect(chartData.unavailable).toEqual([
            {
                method: "swr-perpetual",
                label: "SWR Perpetual",
                reason: "Enter a safe withdrawal rate greater than 0% for this comparison.",
            },
        ]);
    });

    it("validates negative values, unsafe rates, and the tax divisor boundary", () => {
        const errors = validateRetirementCorpusForm({
            ...defaultRetirementCorpusValues,
            monthlyExpense: "-1",
            yearsToRetirement: "-1",
            nominalReturnPercent: "-100",
            inflationPercent: "101",
            taxHaircutPercent: "100",
            currentCorpus: "-2",
        });

        expect(errors.monthlyExpense).toBe("Monthly expense cannot be negative.");
        expect(errors.yearsToRetirement).toBe("Years cannot be negative.");
        expect(errors.nominalReturnPercent).toContain("greater than -100%");
        expect(errors.inflationPercent).toContain("no more than 100%");
        expect(errors.taxHaircutPercent).toContain("less than 100%");
        expect(errors.currentCorpus).toBe("Current corpus cannot be negative.");
    });

    it("warns for equal return and inflation during a finite drawdown without hiding the SWR result", () => {
        const result = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            nominalReturnPercent: "8",
        });

        expect(result?.fixedDurationCorpus.value).toBeNull();
        expect(result?.fixedDurationWarning).toContain("must differ from inflation");
        expect(result?.swrPerpetualCorpus.value).not.toBeNull();
        expect(result?.realReturnPerpetualCorpus.value).toBeNull();
        expect(result?.requiredMonthlySIP.value).toBeNull();
    });

    it("keeps a one-time fixed corpus valid when return equals inflation", () => {
        const result = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            nominalReturnPercent: "8",
            drawdownYears: "0",
        });

        expect(result?.fixedDurationCorpus.value).toBeCloseTo(
            result!.annualExpenseAtRetirement / 0.94,
        );
        expect(result?.realReturnPerpetualCorpus.value).toBeNull();
    });

    it("marks invalid perpetual comparisons independently", () => {
        const result = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            safeWithdrawalRatePercent: "0",
            nominalReturnPercent: "6",
            inflationPercent: "8",
        });

        expect(result?.fixedDurationCorpus.value).not.toBeNull();
        expect(result?.swrPerpetualCorpus.value).toBeNull();
        expect(result?.realReturnPerpetualCorpus.value).toBeNull();
    });

    it("grows the current corpus before calculating the SIP shortfall", () => {
        const result = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            currentCorpus: "10000000",
        });

        expect(result?.currentCorpusAtRetirement).toBeCloseTo(10000000 * Math.pow(1.12, 22), 5);
        expect(result?.shortfall).toBeCloseTo(
            result!.fixedDurationCorpus.value! - result!.currentCorpusAtRetirement,
        );
        expect(result?.achievedFraction).toBeCloseTo(10000000 / result!.fixedDurationCorpus.value!);
        expect(result?.requiredMonthlySIP.value).toBeGreaterThan(0);
        expect(result?.requiredStepUpSIP.value).toBeGreaterThan(0);
    });

    it("returns zero SIPs when current savings already cover the target at retirement", () => {
        const result = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            currentCorpus: "200000000",
        });

        expect(result?.shortfall).toBe(0);
        expect(result?.achievedFraction).toBeGreaterThan(1);
        expect(result?.requiredMonthlySIP.value).toBe(0);
        expect(result?.requiredStepUpSIP.value).toBe(0);
    });

    it("explains immediate retirement shortfalls and supports zero-time covered goals", () => {
        const shortfall = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            yearsToRetirement: "0",
        });

        expect(shortfall?.requiredMonthlySIP.value).toBeNull();
        expect(shortfall?.requiredMonthlySIP.unavailableReason).toContain("No time remains");

        const covered = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            yearsToRetirement: "0",
            currentCorpus: "40000000",
        });

        expect(covered?.requiredMonthlySIP.value).toBe(0);
        expect(covered?.requiredStepUpSIP.value).toBe(0);
    });

    it("keeps the fixed SIP available at zero return while explaining step-up SIP is unavailable", () => {
        const result = calculateRetirementCorpus({
            ...defaultRetirementCorpusValues,
            nominalReturnPercent: "0",
            inflationPercent: "2",
        });

        expect(result?.requiredMonthlySIP.value).toBeGreaterThan(0);
        expect(result?.requiredStepUpSIP.value).toBeNull();
        expect(result?.requiredStepUpSIP.unavailableReason).toContain("non-zero");
    });
});