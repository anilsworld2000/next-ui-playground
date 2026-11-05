import {
    requiredMonthlySIP,
    requiredStepUpSIP,
} from "../../../lib/financeCalculations";

export type SIPPlannerMode = "fixed" | "step-up";

export type SIPPlannerField =
    | "targetAmount"
    | "years"
    | "annualReturnPercent"
    | "stepUpRatePercent";

export interface SIPPlannerFormValues {
    targetAmount: string;
    years: string;
    annualReturnPercent: string;
    stepUpRatePercent: string;
}

export type SIPPlannerValidationErrors = Partial<Record<SIPPlannerField, string>>;

export interface SIPPlannerResult {
    monthlyAmount: number;
    yearOneMonthlyAmount: number;
    finalYearMonthlyAmount: number | null;
}

const requiredFieldsByMode: Record<SIPPlannerMode, SIPPlannerField[]> = {
    fixed: ["targetAmount", "years", "annualReturnPercent"],
    "step-up": ["targetAmount", "years", "annualReturnPercent", "stepUpRatePercent"],
};

function parseNumber(value: string): number | null {
    if (!value.trim()) return null;
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function validateSIPPlannerForm(
    mode: SIPPlannerMode,
    values: SIPPlannerFormValues,
): SIPPlannerValidationErrors {
    const errors: SIPPlannerValidationErrors = {};

    for (const field of requiredFieldsByMode[mode]) {
        const rawValue = values[field];
        const value = parseNumber(rawValue);

        if (value === null) {
            errors[field] = rawValue.trim() ? "Enter a valid number." : "This field is required.";
            continue;
        }

        if (field === "targetAmount" && value < 0) {
            errors[field] = "Target amount cannot be negative.";
        } else if (field === "years" && value <= 0) {
            errors[field] = "Years must be greater than zero.";
        } else if (
            (field === "annualReturnPercent" || field === "stepUpRatePercent")
            && (value < 0 || value > 100)
        ) {
            errors[field] = "Rate must be between 0% and 100%.";
        }
    }

    if (mode === "step-up" && parseNumber(values.annualReturnPercent) === 0) {
        errors.annualReturnPercent = "Step-up SIP requires a non-zero expected annual return.";
    }

    return errors;
}

export function calculateSIPPlannerResult(
    mode: SIPPlannerMode,
    values: SIPPlannerFormValues,
): SIPPlannerResult | null {
    if (Object.keys(validateSIPPlannerForm(mode, values)).length > 0) {
        return null;
    }

    const targetFV = Number(values.targetAmount);
    const years = Number(values.years);
    const annualRate = Number(values.annualReturnPercent) / 100;

    if (mode === "fixed") {
        const monthlyAmount = requiredMonthlySIP({ targetFV, annualRate, years });

        return {
            monthlyAmount,
            yearOneMonthlyAmount: monthlyAmount,
            finalYearMonthlyAmount: null,
        };
    }

    const stepUpRate = Number(values.stepUpRatePercent) / 100;
    const monthlyAmount = requiredStepUpSIP({ targetFV, annualRate, stepUpRate, years });

    return {
        monthlyAmount,
        yearOneMonthlyAmount: monthlyAmount,
        finalYearMonthlyAmount: monthlyAmount * Math.pow(1 + stepUpRate, years - 1),
    };
}
