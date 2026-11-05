import {
    futureValueLumpSum,
    percentAchieved,
    realReturn,
    requiredMonthlySIP,
    requiredStepUpSIP,
    retirementCorpusFixedDuration,
    retirementCorpusPerpetualRealReturn,
    retirementCorpusPerpetualSWR,
} from "../../../lib/financeCalculations";

export type RetirementCorpusField =
    | "monthlyExpense"
    | "expenseMultiplier"
    | "yearsToRetirement"
    | "drawdownYears"
    | "nominalReturnPercent"
    | "inflationPercent"
    | "taxHaircutPercent"
    | "safeWithdrawalRatePercent"
    | "currentCorpus"
    | "stepUpRatePercent";

export interface RetirementCorpusFormValues {
    monthlyExpense: string;
    expenseMultiplier: string;
    yearsToRetirement: string;
    drawdownYears: string;
    nominalReturnPercent: string;
    inflationPercent: string;
    taxHaircutPercent: string;
    safeWithdrawalRatePercent: string;
    currentCorpus: string;
    stepUpRatePercent: string;
}

export type RetirementCorpusValidationErrors = Partial<Record<RetirementCorpusField, string>>;

export interface AvailableFigure {
    value: number | null;
    unavailableReason?: string;
}

export interface RetirementCorpusCalculation {
    annualExpenseAtRetirement: number;
    fixedDurationCorpus: AvailableFigure;
    swrPerpetualCorpus: AvailableFigure;
    realReturnRate: number;
    realReturnPerpetualCorpus: AvailableFigure;
    currentCorpusAtRetirement: number;
    shortfall: number | null;
    achievedFraction: number | null;
    requiredMonthlySIP: AvailableFigure;
    requiredStepUpSIP: AvailableFigure;
    fixedDurationWarning?: string;
}

export type RetirementCorpusChartMethod = "fixed-duration" | "swr-perpetual" | "real-return-perpetual";

export interface RetirementCorpusChartItem {
    method: RetirementCorpusChartMethod;
    label: string;
    value: number;
}

export interface UnavailableRetirementCorpusChartItem {
    method: RetirementCorpusChartMethod;
    label: string;
    reason: string;
}

export interface RetirementCorpusChartData {
    available: RetirementCorpusChartItem[];
    unavailable: UnavailableRetirementCorpusChartItem[];
}

export const defaultRetirementCorpusValues: RetirementCorpusFormValues = {
    monthlyExpense: "100000",
    expenseMultiplier: "16.8",
    yearsToRetirement: "22",
    drawdownYears: "26",
    nominalReturnPercent: "12",
    inflationPercent: "8",
    taxHaircutPercent: "6",
    safeWithdrawalRatePercent: "3",
    currentCorpus: "0",
    stepUpRatePercent: "10",
};

export function getRetirementCorpusChartData(
    calculation: RetirementCorpusCalculation,
): RetirementCorpusChartData {
    const figures: {
        method: RetirementCorpusChartMethod;
        label: string;
        figure: AvailableFigure;
    }[] = [
        {
            method: "fixed-duration",
            label: "Fixed Duration",
            figure: calculation.fixedDurationCorpus,
        },
        {
            method: "swr-perpetual",
            label: "SWR Perpetual",
            figure: calculation.swrPerpetualCorpus,
        },
        {
            method: "real-return-perpetual",
            label: "Real Return Perpetual",
            figure: calculation.realReturnPerpetualCorpus,
        },
    ];

    return figures.reduce<RetirementCorpusChartData>((chartData, { method, label, figure }) => {
        if (figure.value !== null && Number.isFinite(figure.value)) {
            chartData.available.push({ method, label, value: figure.value });
        } else {
            chartData.unavailable.push({
                method,
                label,
                reason: figure.unavailableReason ?? "This comparison is unavailable for the current inputs.",
            });
        }

        return chartData;
    }, { available: [], unavailable: [] });
}

const requiredFields: RetirementCorpusField[] = [
    "monthlyExpense",
    "expenseMultiplier",
    "yearsToRetirement",
    "drawdownYears",
    "nominalReturnPercent",
    "inflationPercent",
    "taxHaircutPercent",
    "safeWithdrawalRatePercent",
    "stepUpRatePercent",
];

function parseNumber(value: string): number | null {
    if (!value.trim()) return null;
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

function finiteFigure(value: number, reason: string): AvailableFigure {
    return Number.isFinite(value)
        ? { value }
        : { value: null, unavailableReason: reason };
}

export function validateRetirementCorpusForm(
    values: RetirementCorpusFormValues,
): RetirementCorpusValidationErrors {
    const errors: RetirementCorpusValidationErrors = {};

    for (const field of requiredFields) {
        const rawValue = values[field];
        const value = parseNumber(rawValue);

        if (value === null) {
            errors[field] = rawValue.trim() ? "Enter a valid number." : "This field is required.";
            continue;
        }

        if ((field === "monthlyExpense" || field === "expenseMultiplier") && value < 0) {
            errors[field] = field === "monthlyExpense"
                ? "Monthly expense cannot be negative."
                : "Multiplier cannot be negative.";
        } else if ((field === "yearsToRetirement" || field === "drawdownYears") && value < 0) {
            errors[field] = "Years cannot be negative.";
        } else if (
            (field === "nominalReturnPercent" || field === "inflationPercent")
            && (value <= -100 || value > 100)
        ) {
            errors[field] = "Rate must be greater than -100% and no more than 100%.";
        } else if (field === "taxHaircutPercent" && (value < 0 || value >= 100)) {
            errors[field] = "Tax haircut must be at least 0% and less than 100%.";
        } else if (field === "safeWithdrawalRatePercent" && (value < 0 || value > 100)) {
            errors[field] = "Safe withdrawal rate must be between 0% and 100%.";
        } else if (field === "stepUpRatePercent" && (value < -100 || value > 100)) {
            errors[field] = "Step-up rate must be between -100% and 100%.";
        }
    }

    const currentCorpusValue = values.currentCorpus.trim() ? parseNumber(values.currentCorpus) : 0;
    if (currentCorpusValue === null) {
        errors.currentCorpus = "Enter a valid number.";
    } else if (currentCorpusValue < 0) {
        errors.currentCorpus = "Current corpus cannot be negative.";
    }

    return errors;
}

export function calculateRetirementCorpus(
    values: RetirementCorpusFormValues,
): RetirementCorpusCalculation | null {
    if (Object.keys(validateRetirementCorpusForm(values)).length > 0) {
        return null;
    }

    const monthlyExpense = Number(values.monthlyExpense);
    const expenseMultiplier = Number(values.expenseMultiplier);
    const yearsToRetirement = Number(values.yearsToRetirement);
    const drawdownYears = Number(values.drawdownYears);
    const nominalReturn = Number(values.nominalReturnPercent) / 100;
    const inflationRate = Number(values.inflationPercent) / 100;
    const taxHaircut = Number(values.taxHaircutPercent) / 100;
    const safeWithdrawalRate = Number(values.safeWithdrawalRatePercent) / 100;
    const currentCorpus = values.currentCorpus.trim() ? Number(values.currentCorpus) : 0;
    const stepUpRate = Number(values.stepUpRatePercent) / 100;
    const annualExpenseAtRetirement = futureValueLumpSum(
        monthlyExpense * expenseMultiplier,
        inflationRate,
        yearsToRetirement,
    );

    const fixedDurationUnavailable = nominalReturn === inflationRate && drawdownYears > 0;
    const fixedDurationWarning = fixedDurationUnavailable
        ? "Expected annual return must differ from inflation when the corpus has a drawdown duration."
        : undefined;
    const fixedDurationCorpus = fixedDurationUnavailable
        ? { value: null, unavailableReason: fixedDurationWarning }
        : finiteFigure(retirementCorpusFixedDuration({
            costBasisToday: monthlyExpense,
            multiplier: expenseMultiplier,
            inflationRate,
            nominalReturn,
            yearsToGoal: yearsToRetirement,
            drawdownYears,
            taxHaircut,
        }), "Fixed-duration corpus is outside the supported numeric range.");

    const swrPerpetualCorpus = safeWithdrawalRate > 0
        ? finiteFigure(
            retirementCorpusPerpetualSWR(annualExpenseAtRetirement, safeWithdrawalRate),
            "Safe-withdrawal corpus is outside the supported numeric range.",
        )
        : { value: null, unavailableReason: "Enter a safe withdrawal rate greater than 0% for this comparison." };

    const realRate = realReturn(nominalReturn, inflationRate);
    const realReturnPerpetualCorpus = realRate > 0
        ? finiteFigure(
            retirementCorpusPerpetualRealReturn(annualExpenseAtRetirement, realRate),
            "Real-return corpus is outside the supported numeric range.",
        )
        : { value: null, unavailableReason: "Real return must be greater than 0% for this perpetual comparison." };

    const currentCorpusAtRetirement = futureValueLumpSum(currentCorpus, nominalReturn, yearsToRetirement);
    const shortfall = fixedDurationCorpus.value === null
        ? null
        : Math.max(0, fixedDurationCorpus.value - currentCorpusAtRetirement);
    const achievedFraction = fixedDurationCorpus.value === null
        ? null
        : percentAchieved(currentCorpus, fixedDurationCorpus.value);

    let requiredMonthlySIPResult: AvailableFigure;
    let requiredStepUpSIPResult: AvailableFigure;

    if (shortfall === null) {
        const reason = "Available when the fixed-duration target corpus can be calculated.";
        requiredMonthlySIPResult = { value: null, unavailableReason: reason };
        requiredStepUpSIPResult = { value: null, unavailableReason: reason };
    } else if (shortfall === 0) {
        requiredMonthlySIPResult = { value: 0 };
        requiredStepUpSIPResult = { value: 0 };
    } else if (yearsToRetirement === 0) {
        const reason = "No time remains to fund this shortfall with future monthly investments.";
        requiredMonthlySIPResult = { value: null, unavailableReason: reason };
        requiredStepUpSIPResult = { value: null, unavailableReason: reason };
    } else {
        requiredMonthlySIPResult = finiteFigure(
            requiredMonthlySIP({ targetFV: shortfall, annualRate: nominalReturn, years: yearsToRetirement }),
            "Required monthly SIP is outside the supported numeric range.",
        );
        requiredStepUpSIPResult = nominalReturn === 0
            ? { value: null, unavailableReason: "Step-up SIP requires a non-zero expected annual return." }
            : finiteFigure(
                requiredStepUpSIP({
                    targetFV: shortfall,
                    annualRate: nominalReturn,
                    stepUpRate,
                    years: yearsToRetirement,
                }),
                "Required step-up SIP is outside the supported numeric range.",
            );
    }

    return {
        annualExpenseAtRetirement,
        fixedDurationCorpus,
        swrPerpetualCorpus,
        realReturnRate: realRate,
        realReturnPerpetualCorpus,
        currentCorpusAtRetirement,
        shortfall,
        achievedFraction,
        requiredMonthlySIP: requiredMonthlySIPResult,
        requiredStepUpSIP: requiredStepUpSIPResult,
        fixedDurationWarning,
    };
}