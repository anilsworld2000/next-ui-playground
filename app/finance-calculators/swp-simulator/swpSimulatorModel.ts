import { simulateSWP } from "../../../lib/financeCalculations";

export type SWPSimulatorField =
    | "initialCorpus"
    | "firstWithdrawal"
    | "annualReturnPercent"
    | "withdrawalGrowthRatePercent"
    | "simulationYears";

export interface SWPSimulatorFormValues {
    initialCorpus: string;
    firstWithdrawal: string;
    annualReturnPercent: string;
    withdrawalGrowthRatePercent: string;
    simulationYears: string;
}

export type SWPSimulatorValidationErrors = Partial<Record<SWPSimulatorField, string>>;

export interface SWPYearSnapshot {
    id: string;
    year: number;
    withdrawalTotal: number;
    endingBalance: number;
    periodsIncluded: number;
    isDepletionYear: boolean;
}

export interface SWPBalanceChartPoint {
    year: number;
    endingBalance: number;
    isDepletionYear: boolean;
}

export interface SWPSimulatorResult {
    totalMonths: number;
    depletedAtPeriod: number | null;
    endingBalance: number;
    yearlySnapshots: SWPYearSnapshot[];
}

export type SWPSimulatorOutcome =
    | { status: "success"; result: SWPSimulatorResult }
    | { status: "error"; message: string }
    | null;

export function getSWPBalanceChartData(
    snapshots: SWPYearSnapshot[],
): SWPBalanceChartPoint[] {
    return snapshots.map(({ year, endingBalance, isDepletionYear }) => ({
        year,
        endingBalance,
        isDepletionYear,
    }));
}

export const defaultSWPSimulatorValues: SWPSimulatorFormValues = {
    initialCorpus: "",
    firstWithdrawal: "",
    annualReturnPercent: "",
    withdrawalGrowthRatePercent: "0",
    simulationYears: "",
};

const MONTHS_PER_YEAR = 12;
const MAX_SIMULATION_MONTHS = 12_000;

const requiredFields: SWPSimulatorField[] = [
    "initialCorpus",
    "firstWithdrawal",
    "annualReturnPercent",
    "withdrawalGrowthRatePercent",
    "simulationYears",
];

function parseNumber(value: string): number | null {
    if (!value.trim()) return null;
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function validateSWPSimulatorForm(
    values: SWPSimulatorFormValues,
): SWPSimulatorValidationErrors {
    const errors: SWPSimulatorValidationErrors = {};

    for (const field of requiredFields) {
        const rawValue = values[field];
        const value = parseNumber(rawValue);

        if (value === null) {
            errors[field] = rawValue.trim() ? "Enter a valid number." : "This field is required.";
            continue;
        }

        if ((field === "initialCorpus" || field === "firstWithdrawal") && value < 0) {
            errors[field] = field === "initialCorpus"
                ? "Initial corpus cannot be negative."
                : "Monthly withdrawal cannot be negative.";
        } else if (field === "simulationYears") {
            if (value <= 0) {
                errors[field] = "Simulation length must be greater than zero.";
            } else {
                const totalMonths = value * MONTHS_PER_YEAR;
                const roundedMonths = Math.round(totalMonths);

                if (
                    !Number.isFinite(totalMonths)
                    || roundedMonths > MAX_SIMULATION_MONTHS
                    || Math.abs(totalMonths - roundedMonths) > 1e-8
                ) {
                    errors[field] = "Enter a duration that resolves to whole months, up to 1,000 years.";
                }
            }
        } else if (field === "annualReturnPercent" && (value < 0 || value > 100)) {
            errors[field] = "Expected annual return must be between 0% and 100%.";
        } else if (
            field === "withdrawalGrowthRatePercent"
            && (value < -100 || value > 100)
        ) {
            errors[field] = "Rate must be between -100% and 100%.";
        }
    }

    return errors;
}

export function calculateSWPSimulatorResult(
    values: SWPSimulatorFormValues,
): SWPSimulatorOutcome {
    if (Object.keys(validateSWPSimulatorForm(values)).length > 0) {
        return null;
    }

    const totalMonths = Math.round(Number(values.simulationYears) * MONTHS_PER_YEAR);
    const simulation = simulateSWP({
        initialCorpus: Number(values.initialCorpus),
        firstWithdrawal: Number(values.firstWithdrawal),
        annualReturn: Number(values.annualReturnPercent) / 100,
        withdrawalGrowthRate: Number(values.withdrawalGrowthRatePercent) / 100,
        totalYears: totalMonths / MONTHS_PER_YEAR,
        periodsPerYear: MONTHS_PER_YEAR,
    });

    if (simulation.schedule.length === 0) {
        return {
            status: "error",
            message: "The simulation did not produce any monthly periods. Check the duration and try again.",
        };
    }

    if (simulation.schedule.some((entry) => (
        !Number.isFinite(entry.startingBalance)
        || !Number.isFinite(entry.withdrawal)
        || !Number.isFinite(entry.growth)
        || !Number.isFinite(entry.endingBalance)
    ))) {
        return {
            status: "error",
            message: "The simulation exceeded the supported numeric range. Try smaller amounts, rates, or duration.",
        };
    }

    const snapshots = new Map<number, SWPYearSnapshot>();

    for (const entry of simulation.schedule) {
        const year = Math.floor((entry.period - 1) / MONTHS_PER_YEAR) + 1;
        const snapshot = snapshots.get(year);

        if (snapshot) {
            snapshot.withdrawalTotal += entry.withdrawal;
            snapshot.endingBalance = entry.endingBalance;
            snapshot.periodsIncluded += 1;
            snapshot.isDepletionYear = snapshot.isDepletionYear
                || simulation.depletedAtPeriod === entry.period;
        } else {
            snapshots.set(year, {
                id: `year-${year}`,
                year,
                withdrawalTotal: entry.withdrawal,
                endingBalance: entry.endingBalance,
                periodsIncluded: 1,
                isDepletionYear: simulation.depletedAtPeriod === entry.period,
            });
        }
    }

    const lastEntry = simulation.schedule[simulation.schedule.length - 1];

    return {
        status: "success",
        result: {
            totalMonths,
            depletedAtPeriod: simulation.depletedAtPeriod,
            endingBalance: lastEntry.endingBalance,
            yearlySnapshots: Array.from(snapshots.values()),
        },
    };
}
