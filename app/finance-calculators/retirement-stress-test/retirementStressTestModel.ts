import {
    futureValueLumpSum,
    requiredStepUpSIP,
    retirementCorpusFixedDuration,
    type MonteCarloParams,
} from "../../../lib/financeCalculations";
import {
    defaultRetirementCorpusValues,
    validateRetirementCorpusForm,
    type RetirementCorpusFormValues,
} from "../retirement-corpus/retirementCorpusModel";

export const SIMULATION_COUNT_OPTIONS = [500, 1000, 2000, 5000, 10000] as const;
export const MAX_SIMULATION_YEARS = 1000;
const MAX_SIMULATION_YEAR_PATHS = 2_000_000;

export interface RetirementStressTestValues extends Omit<RetirementCorpusFormValues, "safeWithdrawalRatePercent"> {
    volatilityPercent: string;
    simulationCount: string;
}

export type RetirementStressTestField = keyof RetirementStressTestValues;
export type RetirementStressTestErrors = Partial<Record<RetirementStressTestField, string>>;

export interface PreparedRetirementStressTest {
    params: MonteCarloParams;
    iterations: number;
    targetCorpus: number;
    requiredMonthlySIP: number;
}

export type PrepareRetirementStressTestResult =
    | { status: "success"; prepared: PreparedRetirementStressTest }
    | { status: "error"; message: string };

export const defaultRetirementStressTestValues: RetirementStressTestValues = {
    monthlyExpense: defaultRetirementCorpusValues.monthlyExpense,
    expenseMultiplier: defaultRetirementCorpusValues.expenseMultiplier,
    yearsToRetirement: defaultRetirementCorpusValues.yearsToRetirement,
    drawdownYears: defaultRetirementCorpusValues.drawdownYears,
    nominalReturnPercent: defaultRetirementCorpusValues.nominalReturnPercent,
    inflationPercent: defaultRetirementCorpusValues.inflationPercent,
    taxHaircutPercent: defaultRetirementCorpusValues.taxHaircutPercent,
    currentCorpus: defaultRetirementCorpusValues.currentCorpus,
    stepUpRatePercent: defaultRetirementCorpusValues.stepUpRatePercent,
    volatilityPercent: "18",
    simulationCount: "2000",
};

function getRetirementCorpusValues(values: RetirementStressTestValues): RetirementCorpusFormValues {
    return {
        ...values,
        safeWithdrawalRatePercent: defaultRetirementCorpusValues.safeWithdrawalRatePercent,
    };
}

function parseFiniteNumber(value: string): number | null {
    if (!value.trim()) return null;
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function validateRetirementStressTestForm(
    values: RetirementStressTestValues,
): RetirementStressTestErrors {
    const baseErrors = validateRetirementCorpusForm(getRetirementCorpusValues(values));
    const errors: RetirementStressTestErrors = {};
    const baseFields = [
        "monthlyExpense",
        "expenseMultiplier",
        "yearsToRetirement",
        "drawdownYears",
        "nominalReturnPercent",
        "inflationPercent",
        "taxHaircutPercent",
        "currentCorpus",
        "stepUpRatePercent",
    ] as const;
    baseFields.forEach((field) => {
        const error = baseErrors[field];
        if (error) errors[field] = error;
    });

    for (const field of ["yearsToRetirement", "drawdownYears"] as const) {
        const value = parseFiniteNumber(values[field]);
        if (value !== null && !errors[field] && !Number.isInteger(value)) {
            errors[field] = "Use a whole number of years for the annual simulation.";
        }
    }

    const yearsToRetirement = parseFiniteNumber(values.yearsToRetirement);
    const drawdownYears = parseFiniteNumber(values.drawdownYears);
    if (
        yearsToRetirement !== null
        && drawdownYears !== null
        && Number.isInteger(yearsToRetirement)
        && Number.isInteger(drawdownYears)
        && yearsToRetirement + drawdownYears > MAX_SIMULATION_YEARS
    ) {
        errors.drawdownYears = `Combined simulation duration cannot exceed ${MAX_SIMULATION_YEARS} years.`;
    }

    const volatility = parseFiniteNumber(values.volatilityPercent);
    if (volatility === null) {
        errors.volatilityPercent = values.volatilityPercent.trim()
            ? "Enter a valid number."
            : "This field is required.";
    } else if (volatility < 0 || volatility > 100) {
        errors.volatilityPercent = "Return volatility must be between 0% and 100%.";
    }

    const simulationCount = parseFiniteNumber(values.simulationCount);
    if (simulationCount === null) {
        errors.simulationCount = values.simulationCount.trim()
            ? "Choose a valid number of simulations."
            : "This field is required.";
    } else if (!SIMULATION_COUNT_OPTIONS.some((count) => count === simulationCount)) {
        errors.simulationCount = "Choose between 500 and 10,000 simulations.";
    }

    if (
        simulationCount !== null
        && SIMULATION_COUNT_OPTIONS.some((count) => count === simulationCount)
        && yearsToRetirement !== null
        && drawdownYears !== null
        && Number.isInteger(yearsToRetirement)
        && Number.isInteger(drawdownYears)
        && simulationCount * (yearsToRetirement + drawdownYears) > MAX_SIMULATION_YEAR_PATHS
    ) {
        errors.simulationCount = "This simulation count and duration exceed the supported workload. Reduce one of them to continue.";
    }

    return errors;
}

export function prepareRetirementStressTest(
    values: RetirementStressTestValues,
): PrepareRetirementStressTestResult {
    const errors = validateRetirementStressTestForm(values);
    if (Object.keys(errors).length > 0) {
        return { status: "error", message: "Correct the highlighted assumptions before running the simulation." };
    }

    const monthlyExpense = Number(values.monthlyExpense);
    const expenseMultiplier = Number(values.expenseMultiplier);
    const yearsToRetirement = Number(values.yearsToRetirement);
    const drawdownYears = Number(values.drawdownYears);
    const nominalReturn = Number(values.nominalReturnPercent) / 100;
    const inflationRate = Number(values.inflationPercent) / 100;
    const taxHaircut = Number(values.taxHaircutPercent) / 100;
    const stepUpRate = Number(values.stepUpRatePercent) / 100;
    const existingCorpus = values.currentCorpus.trim() ? Number(values.currentCorpus) : 0;
    const currentCorpusAtRetirement = futureValueLumpSum(existingCorpus, nominalReturn, yearsToRetirement);
    const firstYearAnnualWithdrawal = futureValueLumpSum(
        monthlyExpense * expenseMultiplier,
        inflationRate,
        yearsToRetirement,
    );

    if (!Number.isFinite(currentCorpusAtRetirement) || !Number.isFinite(firstYearAnnualWithdrawal)) {
        return { status: "error", message: "These assumptions produce an amount outside the supported numeric range." };
    }

    let targetCorpus: number;
    try {
        targetCorpus = retirementCorpusFixedDuration({
            costBasisToday: monthlyExpense,
            multiplier: expenseMultiplier,
            inflationRate,
            nominalReturn,
            yearsToGoal: yearsToRetirement,
            drawdownYears,
            taxHaircut,
        });
    } catch (error) {
        return {
            status: "error",
            message: error instanceof Error ? error.message : "The retirement target could not be calculated.",
        };
    }

    const shortfall = Math.max(0, targetCorpus - currentCorpusAtRetirement);
    if (!Number.isFinite(targetCorpus) || !Number.isFinite(shortfall)) {
        return { status: "error", message: "These assumptions produce a retirement target outside the supported numeric range." };
    }

    if (shortfall > 0 && yearsToRetirement === 0) {
        return { status: "error", message: "No time remains to fund the retirement shortfall with a monthly SIP." };
    }

    if (shortfall > 0 && nominalReturn === 0) {
        return { status: "error", message: "A non-zero expected return is required to calculate a step-up SIP." };
    }

    const requiredMonthlySIP = shortfall === 0
        ? 0
        : requiredStepUpSIP({
            targetFV: shortfall,
            annualRate: nominalReturn,
            stepUpRate,
            years: yearsToRetirement,
        });

    if (!Number.isFinite(requiredMonthlySIP) || requiredMonthlySIP < 0) {
        return { status: "error", message: "The required monthly SIP is outside the supported numeric range." };
    }

    return {
        status: "success",
        prepared: {
            iterations: Number(values.simulationCount),
            targetCorpus,
            requiredMonthlySIP,
            params: {
                existingCorpus,
                monthlyAmount: requiredMonthlySIP,
                stepUpRate,
                yearsToRetirement,
                drawdownYears,
                meanReturn: nominalReturn,
                stdDevReturn: Number(values.volatilityPercent) / 100,
                inflationRate,
                taxHaircut,
                firstYearAnnualWithdrawal,
            },
        },
    };
}
