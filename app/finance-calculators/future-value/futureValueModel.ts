import {
    futureValueLumpSum,
    futureValueSIP,
    futureValueStepUpSIP,
} from "../../../lib/financeCalculations";

export type FutureValueMode = "lump-sum" | "monthly-sip" | "step-up-sip";

export type FutureValueField =
    | "presentValue"
    | "monthlyAmount"
    | "annualReturnPercent"
    | "annualStepUpPercent"
    | "years";

export interface FutureValueFormValues {
    presentValue: string;
    monthlyAmount: string;
    annualReturnPercent: string;
    annualStepUpPercent: string;
    years: string;
}

export type FutureValueValidationErrors = Partial<Record<FutureValueField, string>>;

export interface FutureValueResult {
    futureValue: number;
    totalInvested: number;
}

const requiredFieldsByMode: Record<FutureValueMode, FutureValueField[]> = {
    "lump-sum": ["presentValue", "annualReturnPercent", "years"],
    "monthly-sip": ["monthlyAmount", "annualReturnPercent", "years"],
    "step-up-sip": ["monthlyAmount", "annualReturnPercent", "annualStepUpPercent", "years"],
};

const moneyFields: FutureValueField[] = ["presentValue", "monthlyAmount"];
const rateFields: FutureValueField[] = ["annualReturnPercent", "annualStepUpPercent"];

function parseNumber(value: string): number | null {
    if (!value.trim()) return null;
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function validateFutureValueForm(
    mode: FutureValueMode,
    values: FutureValueFormValues,
): FutureValueValidationErrors {
    const errors: FutureValueValidationErrors = {};

    for (const field of requiredFieldsByMode[mode]) {
        const rawValue = values[field];
        const value = parseNumber(rawValue);

        if (value === null) {
            errors[field] = rawValue.trim() ? "Enter a valid number." : "This field is required.";
            continue;
        }

        if (moneyFields.includes(field) && value < 0) {
            errors[field] = "Amount cannot be negative.";
        } else if (field === "years" && value <= 0) {
            errors[field] = "Years must be greater than zero.";
        } else if (rateFields.includes(field) && (value < -100 || value > 100)) {
            errors[field] = "Rate must be between -100% and 100%.";
        }
    }

    if (mode === "step-up-sip" && parseNumber(values.annualReturnPercent) === 0) {
        errors.annualReturnPercent = "Step-up SIP requires a non-zero expected annual return.";
    }

    return errors;
}

export function calculateStepUpTotalInvested(
    monthlyAmount: number,
    annualStepUpRate: number,
    years: number,
): number {
    const fullYears = Math.floor(years);
    const partialYear = years - fullYears;
    const annualContribution = monthlyAmount * 12;
    const annualGrowthFactor = 1 + annualStepUpRate;
    const fullYearContributions = annualStepUpRate === 0
        ? annualContribution * fullYears
        : annualContribution * (Math.pow(annualGrowthFactor, fullYears) - 1) / annualStepUpRate;
    const partialYearContributions = annualContribution * Math.pow(annualGrowthFactor, fullYears) * partialYear;

    return fullYearContributions + partialYearContributions;
}

export function calculateFutureValue(
    mode: FutureValueMode,
    values: FutureValueFormValues,
): FutureValueResult | null {
    if (Object.keys(validateFutureValueForm(mode, values)).length > 0) {
        return null;
    }

    const annualRate = Number(values.annualReturnPercent) / 100;
    const years = Number(values.years);

    if (mode === "lump-sum") {
        const presentValue = Number(values.presentValue);
        return {
            futureValue: futureValueLumpSum(presentValue, annualRate, years),
            totalInvested: presentValue,
        };
    }

    const monthlyAmount = Number(values.monthlyAmount);

    if (mode === "monthly-sip") {
        return {
            futureValue: futureValueSIP({ monthlyAmount, annualRate, years }),
            totalInvested: monthlyAmount * years * 12,
        };
    }

    const annualStepUpRate = Number(values.annualStepUpPercent) / 100;

    return {
        futureValue: futureValueStepUpSIP({ monthlyAmount, annualRate, stepUpRate: annualStepUpRate, years }),
        totalInvested: calculateStepUpTotalInvested(monthlyAmount, annualStepUpRate, years),
    };
}