"use client";

import { useDeferredValue, useState, type ChangeEvent } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { Column } from "../../types/ui";
import Card from "../../components/Cards/Card";
import DataGrid from "../../components/Tables/DataGrid";
import cnClassNames from "../../utils";
import { formatCompactCurrency, formatCurrency } from "../formatCurrency";
import {
    calculateSWPSimulatorResult,
    defaultSWPSimulatorValues,
    getSWPBalanceChartData,
    validateSWPSimulatorForm,
    type SWPSimulatorField,
    type SWPSimulatorFormValues,
    type SWPYearSnapshot,
} from "./swpSimulatorModel";

interface FieldConfig {
    name: SWPSimulatorField;
    label: string;
    suffix: string;
    hint: string;
}

const fields: FieldConfig[] = [
    {
        name: "initialCorpus",
        label: "Initial Corpus",
        suffix: "₹",
        hint: "Total amount available at the start of the simulation.",
    },
    {
        name: "firstWithdrawal",
        label: "Monthly Withdrawal (first month)",
        suffix: "₹",
        hint: "The withdrawal for month 1; later withdrawals grow annually.",
    },
    {
        name: "annualReturnPercent",
        label: "Expected Annual Return",
        suffix: "%",
        hint: "Allowed range: 0% to 100%; modeled as annual return divided across months.",
    },
    {
        name: "withdrawalGrowthRatePercent",
        label: "Withdrawal Growth Rate",
        suffix: "%",
        hint: "Annual increase in the monthly withdrawal; use 0% for flat withdrawals.",
    },
    {
        name: "simulationYears",
        label: "Simulation Length",
        suffix: "years",
        hint: "Positive durations resolving to whole months are supported, up to 1,000 years.",
    },
];

const columns: Column<SWPYearSnapshot>[] = [
    {
        header: "Year",
        accessor: "year",
        sortable: true,
        render: (_value, record) => (
            <span className={record.isDepletionYear ? "font-bold text-danger" : "text-main"}>
                Year {record.year}
                {record.isDepletionYear && (
                    <span className="ml-2 rounded bg-danger-surface px-2 py-0.5 text-[10px] font-semibold text-danger">
                        Depleted
                    </span>
                )}
            </span>
        ),
    },
    {
        header: "Withdrawal",
        accessor: "withdrawalTotal",
        sortable: true,
        render: (_value, record) => (
            <span className={record.isDepletionYear ? "font-semibold text-danger" : "text-main"}>
                {formatCurrency(record.withdrawalTotal)}
            </span>
        ),
    },
    {
        header: "Ending Balance",
        accessor: "endingBalance",
        sortable: true,
        render: (_value, record) => (
            <span className={record.isDepletionYear ? "font-semibold text-danger" : "text-main"}>
                {formatCurrency(record.endingBalance)}
            </span>
        ),
    },
];

function formatElapsedPeriods(periods: number): string {
    const years = Math.floor(periods / 12);
    const months = periods % 12;

    return `${years} ${years === 1 ? "year" : "years"} and ${months} ${months === 1 ? "month" : "months"}`;
}

export default function SWPSimulatorPage() {
    const [values, setValues] = useState<SWPSimulatorFormValues>({ ...defaultSWPSimulatorValues });
    const [touched, setTouched] = useState<Partial<Record<SWPSimulatorField, boolean>>>({});
    const deferredValues = useDeferredValue(values);
    const errors = validateSWPSimulatorForm(values);
    const deferredErrors = validateSWPSimulatorForm(deferredValues);
    const isUpdating = deferredValues !== values;
    const outcome = isUpdating || Object.keys(deferredErrors).length > 0
        ? null
        : calculateSWPSimulatorResult(deferredValues);
    const result = outcome?.status === "success" ? outcome.result : null;

    function updateField(field: SWPSimulatorField, value: string) {
        setValues((current) => ({ ...current, [field]: value }));
        setTouched((current) => ({ ...current, [field]: true }));
    }

    function touchField(field: SWPSimulatorField) {
        setTouched((current) => ({ ...current, [field]: true }));
    }

    const simulationYears = Number(deferredValues.simulationYears);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-3xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Finance Calculators
                </p>
                <h1 className="text-2xl font-bold text-main">SWP Simulator</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    See how monthly withdrawals and periodic growth may affect your corpus over time.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.5fr)]">
                <form
                    aria-label="SWP simulation assumptions"
                    className="space-y-5"
                    onSubmit={(event) => event.preventDefault()}
                >
                    {fields.map((field) => {
                        const error = errors[field.name];
                        const rawValue = values[field.name];
                        const showError = Boolean(error && (touched[field.name] || rawValue.trim()));

                        return (
                            <NumberField
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                suffix={field.suffix}
                                hint={field.hint}
                                value={rawValue}
                                error={showError ? error : undefined}
                                onChange={(event) => updateField(field.name, event.currentTarget.value)}
                                onBlur={() => touchField(field.name)}
                            />
                        );
                    })}
                </form>

                <section aria-label="SWP simulation results" className="min-w-0 space-y-5">
                    <Card className="border-border-subtle bg-surface p-6">
                        <h2 className="text-sm font-semibold text-muted">Simulation outlook</h2>
                        {isUpdating ? (
                            <p className="mt-4 text-sm text-muted" role="status">Updating simulation…</p>
                        ) : outcome?.status === "error" ? (
                            <p className="mt-4 text-sm leading-6 text-danger" role="alert">
                                {outcome.message}
                            </p>
                        ) : result ? (
                            <p
                                className={cnClassNames(
                                    "mt-3 text-lg font-bold leading-7",
                                    result.depletedAtPeriod !== null ? "text-danger" : "text-main",
                                )}
                                role="status"
                                aria-live="polite"
                            >
                                {result.depletedAtPeriod !== null
                                    ? `⚠️ Corpus depletes after approximately ${formatElapsedPeriods(result.depletedAtPeriod)}.`
                                    : `Corpus lasts the full ${simulationYears} ${simulationYears === 1 ? "year" : "years"}, ending at ${formatCurrency(result.endingBalance)}.`}
                            </p>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-muted">
                                Enter valid assumptions to see the projected withdrawal schedule.
                            </p>
                        )}
                    </Card>

                    {result && (
                        <Card className="min-w-0 border-border-subtle bg-surface p-4 sm:p-6">
                            <h2 className="mb-4 text-sm font-semibold text-main">Yearly snapshots</h2>
                            <DataGrid
                                data={result.yearlySnapshots}
                                columns={columns}
                                autoHeight
                                ariaLabel="Yearly SWP withdrawal and ending-balance snapshots"
                                emptyMessage="No simulation periods to display."
                            />
                            {result.yearlySnapshots.some((snapshot) => snapshot.periodsIncluded < 12) && (
                                <p className="mt-3 text-xs leading-5 text-muted">
                                    The final row may represent a partial year. A depletion row includes the withdrawal made in the period when the balance reached zero.
                                </p>
                            )}
                            <div className="mt-6 border-t border-border-subtle pt-5">
                                <h3 className="mb-1 text-sm font-semibold text-main">Ending balance over time</h3>
                                <p className="mb-4 text-xs leading-5 text-muted">
                                    Yearly balance after withdrawals; the line reaches zero in the depletion year.
                                </p>
                                <div
                                    role="img"
                                    aria-label="Line chart of yearly ending balance, with the depletion year shown at zero when applicable"
                                    className="h-72 w-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={getSWPBalanceChartData(result.yearlySnapshots)}
                                            margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
                                            accessibilityLayer
                                        >
                                            <CartesianGrid stroke="var(--theme-border-subtle)" strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="year"
                                                type="number"
                                                domain={["dataMin", "dataMax"]}
                                                allowDecimals={false}
                                                tick={{ fill: "var(--theme-muted)", fontSize: 12 }}
                                                tickLine={{ stroke: "var(--theme-border-subtle)" }}
                                                axisLine={{ stroke: "var(--theme-border-subtle)" }}
                                                label={{ value: "Year", position: "insideBottom", offset: -4, fill: "var(--theme-muted)" }}
                                            />
                                            <YAxis
                                                domain={[0, "auto"]}
                                                tickFormatter={formatCompactCurrency}
                                                tick={{ fill: "var(--theme-muted)", fontSize: 12 }}
                                                tickLine={{ stroke: "var(--theme-border-subtle)" }}
                                                axisLine={{ stroke: "var(--theme-border-subtle)" }}
                                                width={76}
                                            />
                                            <ReferenceLine y={0} stroke="var(--theme-danger)" strokeDasharray="4 4" />
                                            <Tooltip
                                                labelFormatter={(label) => `Year ${label}`}
                                                formatter={(value) => formatCurrency(Number(value))}
                                                contentStyle={{
                                                    backgroundColor: "var(--theme-surface)",
                                                    borderColor: "var(--theme-border-subtle)",
                                                    borderRadius: "0.5rem",
                                                }}
                                                labelStyle={{ color: "var(--theme-main)" }}
                                                itemStyle={{ color: "var(--theme-primary)" }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="endingBalance"
                                                name="Ending balance"
                                                stroke="var(--theme-primary)"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: "var(--theme-primary)", stroke: "var(--theme-surface)", strokeWidth: 2 }}
                                                activeDot={{ r: 6, fill: "var(--theme-primary)" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
}

interface NumberFieldProps {
    name: SWPSimulatorField;
    label: string;
    suffix: string;
    hint: string;
    value: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

function NumberField({ name, label, suffix, hint, value, error, onChange, onBlur }: NumberFieldProps) {
    const inputId = `swp-simulator-${name}`;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-semibold text-main">
                {label}
            </label>
            <div className={cnClassNames(
                "flex min-h-11 items-center overflow-hidden rounded-md border focus-within:ring-2 focus-within:ring-focus",
                "bg-canvas",
                error ? "border-danger" : "border-border-subtle",
            )}>
                <input
                    id={inputId}
                    name={name}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-main outline-none"
                />
                <span className="px-3 text-sm text-muted" aria-hidden="true">{suffix}</span>
            </div>
            <p id={hintId} className="text-xs leading-5 text-muted">{hint}</p>
            {error && <p id={errorId} className="text-xs leading-5 text-danger">{error}</p>}
        </div>
    );
}
