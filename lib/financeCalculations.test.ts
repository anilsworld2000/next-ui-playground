import { afterEach, describe, expect, it, vi } from "vitest";
import {
    futureValueLumpSum,
    futureValueSIP,
    futureValueStepUpSIP,
    gaussianRandom,
    inflatedValue,
    percentAchieved,
    percentile,
    realReturn,
    requiredMonthlySIP,
    requiredStepUpSIP,
    retirementCorpusFixedDuration,
    retirementCorpusPerpetualRealReturn,
    retirementCorpusPerpetualSWR,
    runMonteCarlo,
    simulateRetirementPath,
    simulateSWP,
} from "./financeCalculations";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("finance calculations", () => {
    it("calculates lump-sum value, inflation, and real return", () => {
        expect(futureValueLumpSum(1000, 0.1, 2)).toBeCloseTo(1210);
        expect(inflatedValue(50000, 0.06, 3)).toBeCloseTo(59550.8);
        expect(realReturn(0.12, 0.04)).toBeCloseTo((1.12 / 1.04) - 1);
    });

    it("calculates a fixed SIP and reverses its target", () => {
        const futureValue = futureValueSIP({ monthlyAmount: 1000, annualRate: 0.12, years: 3 });

        expect(futureValue).toBeGreaterThan(36000);
        expect(requiredMonthlySIP({ targetFV: futureValue, annualRate: 0.12, years: 3 })).toBeCloseTo(1000);
        expect(futureValueSIP({ monthlyAmount: 1000, annualRate: 0, years: 3 })).toBe(36000);
        expect(requiredMonthlySIP({ targetFV: 36000, annualRate: 0, years: 3 })).toBe(1000);
    });

    it("matches the step-up SIP formula against a month-by-month simulation", () => {
        const params = { monthlyAmount: 1000, annualRate: 0.12, stepUpRate: 0.1, years: 3 };
        const actual = futureValueStepUpSIP(params);
        let simulatedBalance = 0;
        let monthlyAmount = params.monthlyAmount;

        for (let month = 1; month <= params.years * 12; month += 1) {
            if (month > 1 && (month - 1) % 12 === 0) {
                monthlyAmount *= 1 + params.stepUpRate;
            }
            simulatedBalance = simulatedBalance * (1 + params.annualRate / 12) + monthlyAmount;
        }

        expect(actual).toBeCloseTo(simulatedBalance, 8);
        expect(requiredStepUpSIP({
            targetFV: actual,
            annualRate: params.annualRate,
            stepUpRate: params.stepUpRate,
            years: params.years,
        })).toBeCloseTo(params.monthlyAmount, 8);
    });

    it("uses the equal-growth limit for step-up SIP and inverse", () => {
        const annualRate = 0.12;
        const annualGrowthFactor = Math.pow(1 + annualRate / 12, 12);
        const stepUpRate = annualGrowthFactor - 1;
        const expectedFutureValue = 1000
            * ((annualGrowthFactor - 1) / (annualRate / 12))
            * 3
            * Math.pow(annualGrowthFactor, 2);
        const actualFutureValue = futureValueStepUpSIP({
            monthlyAmount: 1000,
            annualRate,
            stepUpRate,
            years: 3,
        });

        expect(actualFutureValue).toBeCloseTo(expectedFutureValue, 8);
        expect(requiredStepUpSIP({
            targetFV: actualFutureValue,
            annualRate,
            stepUpRate,
            years: 3,
        })).toBeCloseTo(1000, 8);
        expect(() => futureValueStepUpSIP({
            monthlyAmount: 1000,
            annualRate: 0,
            stepUpRate: 0.1,
            years: 3,
        })).toThrow("annualRate must not be zero");
        expect(() => requiredStepUpSIP({
            targetFV: 100000,
            annualRate: 0,
            stepUpRate: 0.1,
            years: 3,
        })).toThrow("annualRate must not be zero");
    });

    it("calculates a lump-sum and a finite retirement corpus with a one-time tax haircut", () => {
        const lumpSumParams = {
            costBasisToday: 100,
            multiplier: 1.4,
            inflationRate: 0.05,
            nominalReturn: 0.08,
            yearsToGoal: 10,
            drawdownYears: 0,
            taxHaircut: 0.06,
        };
        const finiteParams = { ...lumpSumParams, drawdownYears: 26 };
        const expenseAtGoalDate = 100 * 1.4 * Math.pow(1.05, 10);
        const growingAnnuityFactor = 1 - Math.pow(1.05 / 1.08, 26);

        expect(retirementCorpusFixedDuration(lumpSumParams)).toBeCloseTo(expenseAtGoalDate / 0.94);
        expect(retirementCorpusFixedDuration(finiteParams)).toBeCloseTo(
            (expenseAtGoalDate / (0.08 - 0.05)) * growingAnnuityFactor / 0.94,
        );
        expect(() => retirementCorpusFixedDuration({ ...finiteParams, nominalReturn: 0.05 }))
            .toThrow("return rate must differ from inflation rate.");
    });

    it("calculates perpetual corpora and achievement ratio", () => {
        expect(retirementCorpusPerpetualSWR(12000, 0.04)).toBe(300000);
        expect(retirementCorpusPerpetualRealReturn(12000, 0.03)).toBe(400000);
        expect(percentAchieved(50000, 100000)).toBe(0.5);
        expect(percentAchieved(50000, 0)).toBe(0);
    });

    it("simulates periodic withdrawals and steps them up annually", () => {
        const result = simulateSWP({
            initialCorpus: 10000,
            firstWithdrawal: 100,
            annualReturn: 0.12,
            withdrawalGrowthRate: 0.1,
            totalYears: 2,
            periodsPerYear: 2,
        });

        expect(result.depletedAtPeriod).toBeNull();
        expect(result.schedule).toHaveLength(4);
        expect(result.schedule[0]).toEqual({
            period: 1,
            startingBalance: 10000,
            withdrawal: 100,
            growth: 600,
            endingBalance: 10500,
        });
        expect(result.schedule[2].period).toBe(3);
        expect(result.schedule[2].withdrawal).toBeCloseTo(110);
        expect(simulateSWP({
            initialCorpus: 10000,
            firstWithdrawal: 100,
            annualReturn: 0,
            withdrawalGrowthRate: 0,
            totalYears: 1,
        }).schedule).toHaveLength(12);
    });

    it("records the depletion period and clamps the balance to zero", () => {
        const result = simulateSWP({
            initialCorpus: 1000,
            firstWithdrawal: 500,
            annualReturn: 0,
            withdrawalGrowthRate: 0,
            totalYears: 5,
            periodsPerYear: 1,
        });

        expect(result.depletedAtPeriod).toBe(2);
        expect(result.schedule).toHaveLength(2);
        expect(result.schedule[1].endingBalance).toBe(0);
        expect(() => simulateSWP({
            initialCorpus: 1000,
            firstWithdrawal: 0,
            annualReturn: 0,
            withdrawalGrowthRate: 0,
            totalYears: 0.1,
        })).toThrow("non-negative integer number of periods");
    });
});

describe("Monte Carlo retirement calculations", () => {
    const baseParams = {
        existingCorpus: 1000,
        monthlyAmount: 100,
        stepUpRate: 0.1,
        yearsToRetirement: 1,
        drawdownYears: 1,
        meanReturn: 0,
        stdDevReturn: 0,
        inflationRate: 0,
        taxHaircut: 0.1,
        firstYearAnnualWithdrawal: 1200,
    };

    const retirementRegressionInputs = {
        targetFV: 148548127,
        annualRate: 0.12,
        stepUpRate: 0.1,
        years: 20,
        existingCorpus: 2990852,
        inflationRate: 0.08,
        drawdownYears: 26,
        taxHaircut: 0.06,
        costBasisToday: 100000,
        multiplier: 16.8,
    };

    function createRetirementRegressionParams(stdDevReturn: number) {
        const monthlyAmount = requiredStepUpSIP({
            targetFV: retirementRegressionInputs.targetFV,
            annualRate: retirementRegressionInputs.annualRate,
            stepUpRate: retirementRegressionInputs.stepUpRate,
            years: retirementRegressionInputs.years,
        });

        return {
            existingCorpus: retirementRegressionInputs.existingCorpus,
            monthlyAmount,
            stepUpRate: retirementRegressionInputs.stepUpRate,
            yearsToRetirement: retirementRegressionInputs.years,
            drawdownYears: retirementRegressionInputs.drawdownYears,
            meanReturn: retirementRegressionInputs.annualRate,
            stdDevReturn,
            inflationRate: retirementRegressionInputs.inflationRate,
            taxHaircut: retirementRegressionInputs.taxHaircut,
            firstYearAnnualWithdrawal: retirementRegressionInputs.costBasisToday
                * retirementRegressionInputs.multiplier
                * Math.pow(1 + retirementRegressionInputs.inflationRate, retirementRegressionInputs.years),
        };
    }

    it("retries a zero Box-Muller input and clamps the generated return at -95%", () => {
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0.5);

        expect(gaussianRandom(0, 10)).toBe(-0.95);
    });

    it("does not cap the upper end of a generated return", () => {
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0);

        expect(gaussianRandom(0, 10)).toBeGreaterThan(1);
    });

    it("applies monthly accumulation, the retirement tax haircut, and annual drawdown in order", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        const result = simulateRetirementPath(baseParams);

        expect(result).toEqual({
            yearlyBalances: [1000, 1980, 780],
            corpusAtRetirement: 1980,
            finalBalance: 780,
            survived: true,
            depletedAtYear: null,
        });
    });

    it("uses annualReturn / 12 for each accumulation month", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        const result = simulateRetirementPath({
            ...baseParams,
            monthlyAmount: 0,
            yearsToRetirement: 1,
            drawdownYears: 0,
            meanReturn: 0.12,
            taxHaircut: 0,
        });

        expect(result.corpusAtRetirement).toBeCloseTo(1000 * Math.pow(1.01, 12));
    });

    it("records the first depleted year and keeps later yearly balances at zero", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        const result = simulateRetirementPath({
            ...baseParams,
            yearsToRetirement: 0,
            drawdownYears: 2,
            taxHaircut: 0,
            firstYearAnnualWithdrawal: 1200,
        });

        expect(result.yearlyBalances).toEqual([1000, 0, 0]);
        expect(result.finalBalance).toBe(0);
        expect(result.survived).toBe(false);
        expect(result.depletedAtYear).toBe(1);
    });

    it("interpolates percentiles and rejects invalid percentile inputs", () => {
        expect(percentile([0, 2, 4, 6], 0.25)).toBe(1.5);
        expect(percentile([10], 0.9)).toBe(10);
        expect(() => percentile([], 0.5)).toThrow("must not be empty");
        expect(() => percentile([0, 1], 1.1)).toThrow("between 0 and 1");
        expect(() => percentile([1, 0], 0.5)).toThrow("sorted in ascending order");
    });

    it("aggregates survival, percentile, fan-chart, and failed-path depletion results", () => {
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0);

        const result = runMonteCarlo({
            ...baseParams,
            yearsToRetirement: 0,
            drawdownYears: 1,
            meanReturn: 0,
            stdDevReturn: 100,
            taxHaircut: 0,
            firstYearAnnualWithdrawal: 1200,
        }, 2);

        expect(result.iterations).toBe(2);
        expect(result.successRate).toBe(0.5);
        expect(result.corpusAtRetirementPercentiles).toEqual({
            p10: 1000,
            p25: 1000,
            p50: 1000,
            p75: 1000,
            p90: 1000,
        });
        expect(result.fanChartData).toHaveLength(2);
        expect(result.fanChartData[0]).toEqual({ year: 0, p10: 1000, p50: 1000, p90: 1000 });
        expect(result.fanChartData[1].p10).toBeGreaterThan(0);
        expect(result.medianDepletionYear).toBe(1);
    });

    it("validates iteration counts and simulation parameter boundaries", () => {
        expect(() => runMonteCarlo(baseParams, 0)).toThrow("positive integer");
        expect(() => simulateRetirementPath({ ...baseParams, yearsToRetirement: -1 }))
            .toThrow("non-negative integer");
        expect(() => simulateRetirementPath({ ...baseParams, taxHaircut: 1 }))
            .toThrow("taxHaircut");
    });

    it("defaults to 2,000 simulation paths", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);

        const result = runMonteCarlo({
            ...baseParams,
            yearsToRetirement: 0,
            drawdownYears: 0,
            taxHaircut: 0,
        });

        expect(result.iterations).toBe(2000);
    });

    it("matches the existing accumulation formulas and has deterministic zero-volatility survival", () => {
        const params = createRetirementRegressionParams(0);
        const path = simulateRetirementPath(params);
        const effectiveAnnualReturn = Math.pow(1 + params.meanReturn / 12, 12) - 1;
        const expectedBeforeTax = futureValueStepUpSIP({
            monthlyAmount: params.monthlyAmount,
            annualRate: params.meanReturn,
            stepUpRate: params.stepUpRate,
            years: params.yearsToRetirement,
        }) + futureValueLumpSum(
            params.existingCorpus,
            effectiveAnnualReturn,
            params.yearsToRetirement,
        );
        const expectedAfterTax = expectedBeforeTax * (1 - params.taxHaircut);
        const result = runMonteCarlo(params, 2000);

        expect(Math.abs(path.corpusAtRetirement - expectedAfterTax) / expectedAfterTax).toBeLessThanOrEqual(0.0001);
        expect(result.successRate === 0 || result.successRate === 1).toBe(true);
    });

    it("produces realistic-volatility percentiles, complete fan-chart years, and stable repeated success rates", () => {
        const params = createRetirementRegressionParams(0.18);
        const firstRun = runMonteCarlo(params, 2000);
        const secondRun = runMonteCarlo(params, 2000);

        expect(firstRun.successRate).toBeGreaterThanOrEqual(0);
        expect(firstRun.successRate).toBeLessThanOrEqual(1);
        expect(firstRun.corpusAtRetirementPercentiles.p10)
            .toBeLessThan(firstRun.corpusAtRetirementPercentiles.p50);
        expect(firstRun.corpusAtRetirementPercentiles.p50)
            .toBeLessThan(firstRun.corpusAtRetirementPercentiles.p90);
        expect(firstRun.fanChartData).toHaveLength(
            params.yearsToRetirement + params.drawdownYears + 1,
        );
        expect(Math.abs(firstRun.successRate - secondRun.successRate)).toBeLessThanOrEqual(0.05);
    });
});

describe("spreadsheet-verified calculation values", () => {
    it("matches the expected finite retirement corpus within 1 percent", () => {
        const actual = retirementCorpusFixedDuration({
            costBasisToday: 100000,
            multiplier: 16.8,
            inflationRate: 0.08,
            nominalReturn: 0.12,
            yearsToGoal: 22,
            drawdownYears: 26,
            taxHaircut: 0.06,
        });

        expect(Math.abs(actual - 148548127) / 148548127).toBeLessThanOrEqual(0.01);
    });

    it("matches the expected required monthly SIP within 1 percent", () => {
        const actual = requiredMonthlySIP({
            targetFV: 148548127,
            annualRate: 0.12,
            years: 20,
        });

        expect(Math.abs(actual - 120998) / 120998).toBeLessThanOrEqual(0.01);
    });

    it("matches the expected required step-up SIP within 1 percent", () => {
        const actual = requiredStepUpSIP({
            targetFV: 148548127,
            annualRate: 0.12,
            stepUpRate: 0.1,
            years: 20,
        });

        expect(Math.abs(actual - 75400) / 75400).toBeLessThanOrEqual(0.01);
    });

    it("matches the expected small step-up SIP future value to the nearest rupee", () => {
        const actual = futureValueStepUpSIP({
            monthlyAmount: 1000,
            annualRate: 0.12,
            stepUpRate: 0.1,
            years: 3,
        });

        expect(Math.round(actual)).toBe(47250);
    });

    it("matches the small step-up SIP target in an independent monthly simulation", () => {
        let balance = 0;
        let monthlyAmount = 1000;

        for (let month = 1; month <= 36; month += 1) {
            if (month === 13 || month === 25) {
                monthlyAmount *= 1.1;
            }
            balance = balance * 1.01 + monthlyAmount;
        }

        expect(Math.round(balance)).toBe(47250);
    });

    it("matches the expected inflation-adjusted real return", () => {
        expect(realReturn(0.12, 0.08)).toBeCloseTo(0.037037, 6);
    });

    it("returns zero achievement when the required corpus is zero", () => {
        expect(percentAchieved(100000, 0)).toBe(0);
    });
});