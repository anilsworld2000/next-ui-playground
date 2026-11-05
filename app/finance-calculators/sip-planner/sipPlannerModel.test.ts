import { describe, expect, it } from "vitest";
import {
    calculateSIPPlannerResult,
    validateSIPPlannerForm,
    type SIPPlannerFormValues,
} from "./sipPlannerModel";

const emptyValues: SIPPlannerFormValues = {
    targetAmount: "",
    years: "",
    annualReturnPercent: "",
    stepUpRatePercent: "10",
};

describe("SIP Planner form model", () => {
    it("validates only active mode fields and rejects invalid values", () => {
        expect(validateSIPPlannerForm("fixed", {
            ...emptyValues,
            targetAmount: "100000",
            years: "10",
            annualReturnPercent: "12",
        })).toEqual({});

        expect(validateSIPPlannerForm("step-up", {
            ...emptyValues,
            targetAmount: "-1",
            years: "0",
            annualReturnPercent: "101",
            stepUpRatePercent: "-101",
        })).toEqual({
            targetAmount: "Target amount cannot be negative.",
            years: "Years must be greater than zero.",
            annualReturnPercent: "Rate must be between 0% and 100%.",
            stepUpRatePercent: "Rate must be between 0% and 100%.",
        });
    });

    it("rejects a zero expected return for step-up SIP", () => {
        const values = {
            ...emptyValues,
            targetAmount: "1000000",
            years: "10",
            annualReturnPercent: "0",
        };

        expect(validateSIPPlannerForm("step-up", values).annualReturnPercent)
            .toBe("Step-up SIP requires a non-zero expected annual return.");
        expect(calculateSIPPlannerResult("step-up", values)).toBeNull();
    });

    it("calculates fixed SIP and supports a zero return", () => {
        const values = {
            ...emptyValues,
            targetAmount: "120000",
            years: "1",
            annualReturnPercent: "0",
        };

        expect(calculateSIPPlannerResult("fixed", values)).toEqual({
            monthlyAmount: 10000,
            yearOneMonthlyAmount: 10000,
            finalYearMonthlyAmount: null,
        });
    });

    it("calculates step-up SIP and reports the final-year monthly amount", () => {
        const result = calculateSIPPlannerResult("step-up", {
            ...emptyValues,
            targetAmount: "148548127",
            years: "20",
            annualReturnPercent: "12",
            stepUpRatePercent: "10",
        });

        expect(result?.monthlyAmount).toBeCloseTo(75436.55, 2);
        expect(result?.yearOneMonthlyAmount).toBe(result?.monthlyAmount);
        expect(result?.finalYearMonthlyAmount).toBeCloseTo(
            75436.55 * Math.pow(1.1, 19),
            2,
        );
    });

    it("uses the calculation library limit when annual growth equals the step-up factor", () => {
        const annualRate = 0.5;
        const annualGrowthFactor = Math.pow(1 + annualRate / 12, 12);
        const years = 4;
        const targetFV = 1000
            * ((annualGrowthFactor - 1) / (annualRate / 12))
            * years
            * Math.pow(annualGrowthFactor, years - 1);
        const values = {
            ...emptyValues,
            targetAmount: String(targetFV),
            years: String(years),
            annualReturnPercent: String(annualRate * 100),
            stepUpRatePercent: String((annualGrowthFactor - 1) * 100),
        };

        expect(1 + Number(values.stepUpRatePercent) / 100).toBe(annualGrowthFactor);
        expect(calculateSIPPlannerResult("step-up", values)?.monthlyAmount).toBeCloseTo(1000, 8);
    });
});
