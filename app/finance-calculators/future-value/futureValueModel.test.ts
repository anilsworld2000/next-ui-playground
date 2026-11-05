import { describe, expect, it } from "vitest";
import {
    calculateFutureValue,
    calculateStepUpTotalInvested,
    validateFutureValueForm,
    type FutureValueFormValues,
} from "./futureValueModel";

const emptyValues: FutureValueFormValues = {
    presentValue: "",
    monthlyAmount: "",
    annualReturnPercent: "",
    annualStepUpPercent: "",
    years: "",
};

describe("Future Value form model", () => {
    it("validates only active mode fields and rejects invalid bounds", () => {
        expect(validateFutureValueForm("lump-sum", {
            ...emptyValues,
            presentValue: "1000",
            annualReturnPercent: "8",
            years: "10",
        })).toEqual({});

        expect(validateFutureValueForm("monthly-sip", {
            ...emptyValues,
            monthlyAmount: "-1",
            annualReturnPercent: "101",
            years: "0",
        })).toEqual({
            monthlyAmount: "Amount cannot be negative.",
            annualReturnPercent: "Rate must be between -100% and 100%.",
            years: "Years must be greater than zero.",
        });
    });

    it("reports missing and malformed numeric fields", () => {
        expect(validateFutureValueForm("lump-sum", emptyValues)).toEqual({
            presentValue: "This field is required.",
            annualReturnPercent: "This field is required.",
            years: "This field is required.",
        });
        expect(validateFutureValueForm("lump-sum", {
            ...emptyValues,
            presentValue: "not-a-number",
            annualReturnPercent: "8",
            years: "10",
        }).presentValue).toBe("Enter a valid number.");
    });

    it("rejects a zero expected return for step-up SIP", () => {
        const values = {
            ...emptyValues,
            monthlyAmount: "1000",
            annualReturnPercent: "0",
            annualStepUpPercent: "10",
            years: "3",
        };

        expect(validateFutureValueForm("step-up-sip", values).annualReturnPercent)
            .toBe("Step-up SIP requires a non-zero expected annual return.");
        expect(calculateFutureValue("step-up-sip", values)).toBeNull();
    });

    it("calculates lump sum, monthly SIP, and step-up SIP outputs", () => {
        const lumpSumResult = calculateFutureValue("lump-sum", {
            ...emptyValues,
            presentValue: "1000",
            annualReturnPercent: "10",
            years: "2",
        });

        expect(lumpSumResult?.futureValue).toBeCloseTo(1210);
        expect(lumpSumResult?.totalInvested).toBe(1000);

        expect(calculateFutureValue("monthly-sip", {
            ...emptyValues,
            monthlyAmount: "1000",
            annualReturnPercent: "0",
            years: "3",
        })).toEqual({ futureValue: 36000, totalInvested: 36000 });

        const stepUpResult = calculateFutureValue("step-up-sip", {
            ...emptyValues,
            monthlyAmount: "1000",
            annualReturnPercent: "12",
            annualStepUpPercent: "10",
            years: "3",
        });

        expect(stepUpResult?.futureValue).toBeCloseTo(47169.3001759, 5);
        expect(stepUpResult?.totalInvested).toBeCloseTo(39720);
    });

    it("sums step-up contributions with a prorated fractional year", () => {
        expect(calculateStepUpTotalInvested(1000, 0.1, 2.5)).toBeCloseTo(32460);
        expect(calculateStepUpTotalInvested(1000, 0, 2.5)).toBeCloseTo(30000);
    });
});