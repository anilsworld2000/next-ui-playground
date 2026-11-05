import { describe, expect, it } from "vitest";
import {
    calculateSWPSimulatorResult,
    defaultSWPSimulatorValues,
    getSWPBalanceChartData,
    validateSWPSimulatorForm,
    type SWPSimulatorFormValues,
} from "./swpSimulatorModel";

describe("SWP Simulator form model", () => {
    function successfulResult(values: SWPSimulatorFormValues) {
        const outcome = calculateSWPSimulatorResult(values);
        expect(outcome?.status).toBe("success");
        if (outcome?.status !== "success") {
            throw new Error("Expected SWP simulation to succeed.");
        }

        return outcome.result;
    }

    it("validates required fields, nonnegative amounts, and valid rates", () => {
        expect(validateSWPSimulatorForm(defaultSWPSimulatorValues)).toMatchObject({
            initialCorpus: "This field is required.",
            firstWithdrawal: "This field is required.",
            annualReturnPercent: "This field is required.",
            simulationYears: "This field is required.",
        });

        expect(validateSWPSimulatorForm({
            ...defaultSWPSimulatorValues,
            initialCorpus: "-1",
            firstWithdrawal: "-2",
            annualReturnPercent: "-1",
            withdrawalGrowthRatePercent: "-101",
            simulationYears: "0",
        })).toEqual({
            initialCorpus: "Initial corpus cannot be negative.",
            firstWithdrawal: "Monthly withdrawal cannot be negative.",
            annualReturnPercent: "Expected annual return must be between 0% and 100%.",
            withdrawalGrowthRatePercent: "Rate must be between -100% and 100%.",
            simulationYears: "Simulation length must be greater than zero.",
        });
    });

    it("allows expected annual returns from 0% through 100%", () => {
        for (const rate of ["0", "100"]) {
            expect(validateSWPSimulatorForm({
                ...defaultSWPSimulatorValues,
                initialCorpus: "10000",
                firstWithdrawal: "100",
                annualReturnPercent: rate,
                simulationYears: "1",
            })).not.toHaveProperty("annualReturnPercent");
        }

        expect(validateSWPSimulatorForm({
            ...defaultSWPSimulatorValues,
            annualReturnPercent: "100.01",
        }).annualReturnPercent).toBe("Expected annual return must be between 0% and 100%.");
    });

    it("accepts fractional years that resolve to whole months", () => {
        const values: SWPSimulatorFormValues = {
            ...defaultSWPSimulatorValues,
            initialCorpus: "10000",
            firstWithdrawal: "100",
            annualReturnPercent: "0",
            simulationYears: "2.5",
        };

        expect(validateSWPSimulatorForm(values)).toEqual({});
        expect(successfulResult(values).totalMonths).toBe(30);
    });

    it("rejects durations that do not resolve to whole months or exceed the supported horizon", () => {
        expect(validateSWPSimulatorForm({
            ...defaultSWPSimulatorValues,
            simulationYears: "1.2",
        }).simulationYears).toContain("whole months");
        expect(validateSWPSimulatorForm({
            ...defaultSWPSimulatorValues,
            simulationYears: "1001",
        }).simulationYears).toContain("1,000 years");
    });

    it("aggregates full and partial years into annual snapshots", () => {
        const result = successfulResult({
            ...defaultSWPSimulatorValues,
            initialCorpus: "10000",
            firstWithdrawal: "100",
            annualReturnPercent: "0",
            simulationYears: "2.5",
        });

        expect(result.depletedAtPeriod).toBeNull();
        expect(result.yearlySnapshots).toEqual([
            {
                id: "year-1",
                year: 1,
                withdrawalTotal: 1200,
                endingBalance: 8800,
                periodsIncluded: 12,
                isDepletionYear: false,
            },
            {
                id: "year-2",
                year: 2,
                withdrawalTotal: 1200,
                endingBalance: 7600,
                periodsIncluded: 12,
                isDepletionYear: false,
            },
            {
                id: "year-3",
                year: 3,
                withdrawalTotal: 600,
                endingBalance: 7000,
                periodsIncluded: 6,
                isDepletionYear: false,
            },
        ]);
        expect(result.endingBalance).toBe(7000);
    });

    it("marks the year and month where corpus depletes", () => {
        const result = successfulResult({
            ...defaultSWPSimulatorValues,
            initialCorpus: "1000",
            firstWithdrawal: "100",
            annualReturnPercent: "0",
            simulationYears: "2",
        });

        expect(result.depletedAtPeriod).toBe(10);
        expect(result.endingBalance).toBe(0);
        expect(result.yearlySnapshots).toEqual([{
            id: "year-1",
            year: 1,
            withdrawalTotal: 1000,
            endingBalance: 0,
            periodsIncluded: 10,
            isDepletionYear: true,
        }]);
    });

    it("keeps the zero ending balance in chart data at depletion", () => {
        const chartData = getSWPBalanceChartData([
            {
                id: "year-1",
                year: 1,
                withdrawalTotal: 1000,
                endingBalance: 0,
                periodsIncluded: 10,
                isDepletionYear: true,
            },
        ]);

        expect(chartData).toEqual([{
            year: 1,
            endingBalance: 0,
            isDepletionYear: true,
        }]);
    });

    it("returns no result for non-finite simulated values", () => {
        const result = calculateSWPSimulatorResult({
            ...defaultSWPSimulatorValues,
            initialCorpus: "1e308",
            firstWithdrawal: "1",
            annualReturnPercent: "100",
            simulationYears: "100",
        });

        expect(result).toMatchObject({
            status: "error",
            message: expect.stringContaining("numeric range"),
        });
    });
});
