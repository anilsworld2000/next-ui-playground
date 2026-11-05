"use client";

import { useDeferredValue, useState, type ChangeEvent } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Card from "../../components/Cards/Card";
import cnClassNames from "../../utils";
import { formatCompactCurrency, formatCurrency } from "../formatCurrency";
import {
    calculateRetirementCorpus,
    defaultRetirementCorpusValues,
    getRetirementCorpusChartData,
    validateRetirementCorpusForm,
    type AvailableFigure,
    type RetirementCorpusField,
    type RetirementCorpusFormValues,
} from "./retirementCorpusModel";

interface FieldConfig {
    name: RetirementCorpusField;
    label: string;
    suffix: string;
    hint?: string;
}

interface FieldGroup {
    title: string;
    fields: FieldConfig[];
}

const fieldGroups: FieldGroup[] = [
    {
        title: "Retirement needs",
        fields: [
            { name: "monthlyExpense", label: "Monthly Expense Today", suffix: "₹" },
            {
                name: "expenseMultiplier",
                label: "Expense Multiplier",
                suffix: "×",
                hint: "months of annual expense to cover, including buffer — e.g. 12 x 1.4 = 16.8",
            },
            { name: "yearsToRetirement", label: "Years to Retirement", suffix: "years" },
            {
                name: "drawdownYears",
                label: "Years Corpus Must Last After Retirement",
                suffix: "years",
                hint: "0 = one-time need, no ongoing drawdown.",
            },
        ],
    },
    {
        title: "Return and tax assumptions",
        fields: [
            { name: "nominalReturnPercent", label: "Expected Annual Return (pre-tax nominal)", suffix: "%" },
            { name: "inflationPercent", label: "Inflation Rate", suffix: "%" },
            {
                name: "taxHaircutPercent",
                label: "Tax Haircut on Corpus",
                suffix: "%",
                hint: "one-time estimated haircut for capital gains tax at withdrawal — NOT applied annually to returns",
            },
        ],
    },
    {
        title: "Perpetual comparison and current savings",
        fields: [
            {
                name: "safeWithdrawalRatePercent",
                label: "Safe Withdrawal Rate",
                suffix: "%",
                hint: "Used only for the perpetual safe-withdrawal comparison.",
            },
            { name: "currentCorpus", label: "Current Corpus Already Saved", suffix: "₹" },
            {
                name: "stepUpRatePercent",
                label: "Annual SIP Step-up Rate",
                suffix: "%",
                hint: "Used for the step-up SIP needed to close the shortfall.",
            },
        ],
    },
];

export default function RetirementCorpusPage() {
    const [values, setValues] = useState<RetirementCorpusFormValues>({ ...defaultRetirementCorpusValues });
    const [touched, setTouched] = useState<Partial<Record<RetirementCorpusField, boolean>>>({});
    const deferredValues = useDeferredValue(values);
    const errors = validateRetirementCorpusForm(values);
    const deferredErrors = validateRetirementCorpusForm(deferredValues);
    const isUpdating = deferredValues !== values;
    const calculation = isUpdating || Object.keys(deferredErrors).length > 0
        ? null
        : calculateRetirementCorpus(deferredValues);
    const currentCorpus = values.currentCorpus.trim() ? Number(values.currentCorpus) : 0;
    const corpusChartData = calculation ? getRetirementCorpusChartData(calculation) : null;

    function updateField(field: RetirementCorpusField, value: string) {
        setValues((current) => ({ ...current, [field]: value }));
        setTouched((current) => ({ ...current, [field]: true }));
    }

    function touchField(field: RetirementCorpusField) {
        setTouched((current) => ({ ...current, [field]: true }));
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-3xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Finance Calculators
                </p>
                <h1 className="text-2xl font-bold text-main">Retirement Corpus</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Compare a finite retirement plan with two perpetual corpus estimates. Your return is pre-tax; the tax haircut is applied once to the fixed-duration corpus.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.5fr)]">
                <form
                    aria-label="Retirement corpus assumptions"
                    className="space-y-6"
                    onSubmit={(event) => event.preventDefault()}
                >
                    {fieldGroups.map((group) => (
                        <fieldset key={group.title} className="min-w-0 border-t border-border-subtle pt-5">
                            <legend className="mb-4 pr-3 text-sm font-semibold text-main">
                                {group.title}
                            </legend>
                            <div className="space-y-5">
                                {group.fields.map((field) => {
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
                            </div>
                        </fieldset>
                    ))}
                </form>

                <section aria-label="Retirement corpus results" aria-live="polite" aria-atomic="true" className="min-w-0 space-y-6">
                    {calculation?.fixedDurationWarning && (
                        <p role="status" className="rounded-md border border-warning/50 bg-warning-surface px-4 py-3 text-sm leading-6 text-warning">
                            {calculation.fixedDurationWarning}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <CorpusCard
                            title="Target Corpus (Fixed Duration)"
                            description="Goal-date corpus for the selected finite withdrawal duration, including the one-time tax haircut."
                            figure={calculation?.fixedDurationCorpus}
                            primary
                        />
                        <CorpusCard
                            title="Conservative Alternative (Safe Withdrawal Rate, Perpetual)"
                            description="An indefinite corpus estimate based on annual expense divided by the selected safe withdrawal rate."
                            figure={calculation?.swrPerpetualCorpus}
                        />
                        <CorpusCard
                            title="Conservative Alternative (Real Return, Perpetual)"
                            description="An indefinite corpus estimate based on annual expense divided by the inflation-adjusted real return."
                            figure={calculation?.realReturnPerpetualCorpus}
                        />
                    </div>

                    {corpusChartData && (
                        <Card className="min-w-0 border-border-subtle bg-surface p-5 sm:p-6">
                            <h2 className="text-base font-semibold text-main">Corpus methodology comparison</h2>
                            <p className="mt-2 text-sm leading-6 text-muted">
                                Compare the goal-date fixed-duration target with the two perpetual alternatives.
                            </p>
                            {corpusChartData.available.length > 0 ? (
                                <>
                                    <div
                                        role="img"
                                        aria-label="Bar chart comparing available fixed-duration, safe-withdrawal perpetual, and real-return perpetual corpus estimates"
                                        className="mt-4 h-80 w-full"
                                    >
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={corpusChartData.available}
                                                margin={{ top: 12, right: 12, bottom: 14, left: 8 }}
                                                accessibilityLayer
                                            >
                                                <CartesianGrid stroke="var(--theme-border-subtle)" strokeDasharray="3 3" vertical={false} />
                                                <XAxis
                                                    dataKey="label"
                                                    interval={0}
                                                    tick={{ fill: "var(--theme-muted)", fontSize: 11 }}
                                                    tickLine={{ stroke: "var(--theme-border-subtle)" }}
                                                    axisLine={{ stroke: "var(--theme-border-subtle)" }}
                                                    angle={-12}
                                                    textAnchor="end"
                                                    height={62}
                                                />
                                                <YAxis
                                                    domain={[0, "auto"]}
                                                    tickFormatter={formatCompactCurrency}
                                                    tick={{ fill: "var(--theme-muted)", fontSize: 12 }}
                                                    tickLine={{ stroke: "var(--theme-border-subtle)" }}
                                                    axisLine={{ stroke: "var(--theme-border-subtle)" }}
                                                    width={76}
                                                />
                                                <Tooltip
                                                    formatter={(value) => formatCurrency(Number(value))}
                                                    contentStyle={{
                                                        backgroundColor: "var(--theme-surface)",
                                                        borderColor: "var(--theme-border-subtle)",
                                                        borderRadius: "0.5rem",
                                                    }}
                                                    labelStyle={{ color: "var(--theme-main)" }}
                                                    itemStyle={{ color: "var(--theme-primary)" }}
                                                />
                                                <Bar dataKey="value" name="Required corpus" radius={[5, 5, 0, 0]}>
                                                    {corpusChartData.available.map((entry) => (
                                                        <Cell
                                                            key={entry.method}
                                                            fill={entry.method === "fixed-duration"
                                                                ? "var(--theme-primary)"
                                                                : entry.method === "swr-perpetual"
                                                                    ? "var(--theme-success)"
                                                                    : "var(--theme-info)"}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted" aria-label="Chart methodology values">
                                        {corpusChartData.available.map((entry) => (
                                            <li key={entry.method} className="flex items-center gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className="h-2.5 w-2.5 rounded-sm"
                                                    style={{
                                                        backgroundColor: entry.method === "fixed-duration"
                                                            ? "var(--theme-primary)"
                                                            : entry.method === "swr-perpetual"
                                                                ? "var(--theme-success)"
                                                                : "var(--theme-info)",
                                                    }}
                                                />
                                                {entry.label}: {formatCurrency(entry.value)}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="mt-4 text-sm text-muted">No corpus methods are available to compare for these inputs.</p>
                            )}
                            {corpusChartData.unavailable.length > 0 && (
                                <ul className="mt-4 space-y-2 border-t border-border-subtle pt-4 text-xs leading-5 text-warning">
                                    {corpusChartData.unavailable.map((entry) => (
                                        <li key={entry.method}>
                                            <span className="font-semibold">{entry.label} unavailable:</span> {entry.reason}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <p className="sr-only">
                                {corpusChartData.available.map((entry) => `${entry.label}: ${formatCurrency(entry.value)}.`).join(" ")}
                            </p>
                        </Card>
                    )}

                    {calculation && currentCorpus > 0 && calculation.achievedFraction !== null && (
                        <Card className="border-border-subtle bg-surface p-5">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <h2 className="text-sm font-semibold text-main">Corpus progress</h2>
                                <p className="text-sm font-semibold text-main">
                                    {Math.round(calculation.achievedFraction * 100)}% achieved
                                </p>
                            </div>
                            <div
                                className="mt-3 h-2.5 overflow-hidden rounded-full bg-accent"
                                role="progressbar"
                                aria-label="Current corpus achieved"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.min(100, Math.max(0, calculation.achievedFraction * 100))}
                                aria-valuetext={`${Math.round(calculation.achievedFraction * 100)}% achieved`}
                            >
                                <div
                                    className="h-full rounded-full bg-primary transition-[width]"
                                    style={{ width: `${Math.min(100, Math.max(0, calculation.achievedFraction * 100))}%` }}
                                />
                            </div>
                            <p className="mt-3 text-xs leading-5 text-muted">
                                Progress compares today’s saved corpus with the fixed-duration target; SIP estimates also account for projected growth before retirement.
                            </p>
                        </Card>
                    )}

                    <Card className="border-border-subtle bg-surface p-5 sm:p-6">
                        <div>
                            <h2 className="text-base font-semibold text-main">Monthly investment to close the gap</h2>
                            <p className="mt-2 text-sm leading-6 text-muted">
                                Current savings are projected forward at the expected annual return first; the SIPs below fund only the remaining fixed-duration shortfall.
                            </p>
                        </div>
                        {isUpdating ? (
                            <p className="mt-5 text-sm text-muted">Updating estimate…</p>
                        ) : calculation ? (
                            <>
                                <p className="mt-4 text-xs leading-5 text-muted">
                                    Current corpus grows to {formatCurrency(calculation.currentCorpusAtRetirement)} by retirement.
                                    {calculation.shortfall !== null && <> Shortfall: {formatCurrency(calculation.shortfall)}.</>}
                                </p>
                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <SIPCard
                                        title="Required Monthly SIP"
                                        figure={calculation.requiredMonthlySIP}
                                    />
                                    <SIPCard
                                        title={`Required Monthly SIP (${values.stepUpRatePercent}% annual step-up)`}
                                        figure={calculation.requiredStepUpSIP}
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="mt-5 text-sm text-muted">
                                Enter valid assumptions to calculate the corpus and monthly investments.
                            </p>
                        )}
                    </Card>
                </section>
            </div>
        </div>
    );
}

interface NumberFieldProps {
    name: RetirementCorpusField;
    label: string;
    suffix: string;
    hint?: string;
    value: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

function NumberField({ name, label, suffix, hint, value, error, onChange, onBlur }: NumberFieldProps) {
    const inputId = `retirement-corpus-${name}`;
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
                    aria-describedby={[hint ? hintId : undefined, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-main outline-none"
                />
                <span className="px-3 text-sm text-muted" aria-hidden="true">{suffix}</span>
            </div>
            {hint && <p id={hintId} className="text-xs leading-5 text-muted">{hint}</p>}
            {error && <p id={errorId} className="text-xs leading-5 text-danger">{error}</p>}
        </div>
    );
}

function CorpusCard({
    title,
    description,
    figure,
    primary = false,
}: {
    title: string;
    description: string;
    figure?: AvailableFigure;
    primary?: boolean;
}) {
    return (
        <Card className={cnClassNames(
            "flex min-h-56 flex-col border-border-subtle bg-surface p-5",
            primary && "border-2 border-primary shadow-md",
        )}>
            <p className="text-sm font-semibold leading-5 text-main">{title}</p>
            <div className="mt-5 min-h-10">
                {figure?.value !== null && figure?.value !== undefined ? (
                    <p className={cnClassNames(primary ? "break-words text-2xl font-bold" : "break-words text-lg font-semibold", "text-main")}>
                        {formatCurrency(figure.value)}
                    </p>
                ) : figure?.unavailableReason ? (
                    <p className="text-sm font-medium text-warning">Unavailable</p>
                ) : (
                    <p className="text-sm text-muted">Enter valid assumptions</p>
                )}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">{description}</p>
            {figure?.value === null && figure.unavailableReason && (
                <p className="mt-3 text-xs leading-5 text-warning">{figure.unavailableReason}</p>
            )}
        </Card>
    );
}

function SIPCard({
    title,
    figure,
}: {
    title: string;
    figure: AvailableFigure;
}) {
    return (
        <div className="min-h-28 rounded-md border border-border-subtle p-4">
            <p className="text-sm font-medium text-muted">{title}</p>
            {figure.value !== null ? (
                <p className="mt-2 break-words text-xl font-bold text-main">{formatCurrency(figure.value)}</p>
            ) : (
                <p className="mt-2 text-sm leading-5 text-warning">{figure.unavailableReason}</p>
            )}
        </div>
    );
}