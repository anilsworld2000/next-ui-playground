"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Button from "../../components/Buttons/Button";
import Card from "../../components/Cards/Card";
import cnClassNames from "../../utils";
import type { MonteCarloResult } from "../../../lib/financeCalculations";
import { formatCompactCurrency, formatCurrency } from "../formatCurrency";
import {
    defaultRetirementStressTestValues,
    prepareRetirementStressTest,
    validateRetirementStressTestForm,
    type RetirementStressTestField,
    type RetirementStressTestValues,
} from "./retirementStressTestModel";

interface FieldConfig {
    name: Exclude<RetirementStressTestField, "simulationCount">;
    label: string;
    suffix: string;
    hint?: string;
}

interface SimulationResponse {
    status: "success" | "error";
    result?: MonteCarloResult;
    message?: string;
}

interface FanChartPoint {
    year: number;
    p10: number;
    p50: number;
    p90: number;
    bandStart: number;
    bandRange: number;
}

const fieldGroups: Array<{ title: string; fields: FieldConfig[] }> = [
    {
        title: "Retirement needs",
        fields: [
            { name: "monthlyExpense", label: "Monthly Expense Today", suffix: "₹" },
            {
                name: "expenseMultiplier",
                label: "Expense Multiplier",
                suffix: "×",
                hint: "Months of annual expense to cover, including buffer — for example, 12 × 1.4 = 16.8.",
            },
            { name: "yearsToRetirement", label: "Years to Retirement", suffix: "years" },
            {
                name: "drawdownYears",
                label: "Drawdown Duration",
                suffix: "years",
                hint: "Use whole years; combined simulation duration is limited to 1,000 years.",
            },
            { name: "currentCorpus", label: "Current Corpus Already Saved", suffix: "₹" },
        ],
    },
    {
        title: "Return, inflation, and tax assumptions",
        fields: [
            { name: "nominalReturnPercent", label: "Expected Annual Return", suffix: "%" },
            { name: "inflationPercent", label: "Inflation", suffix: "%" },
            { name: "taxHaircutPercent", label: "Tax Haircut", suffix: "%" },
            { name: "stepUpRatePercent", label: "Annual SIP Step-up Rate", suffix: "%" },
            {
                name: "volatilityPercent",
                label: "Return Volatility (Annual Std Dev)",
                suffix: "%",
                hint: "How much annual returns typically swing around the average — higher for equity-heavy portfolios, lower for a mixed portfolio. This is what makes the simulation realistic instead of assuming every year returns exactly the average.",
            },
        ],
    },
];

const percentileKeys = [
    ["p10", "10th"],
    ["p25", "25th"],
    ["p50", "Median"],
    ["p75", "75th"],
    ["p90", "90th"],
] as const;

function getFanChartData(result: MonteCarloResult): FanChartPoint[] {
    return result.fanChartData.map((point) => ({
        ...point,
        bandStart: point.p10,
        bandRange: point.p90 - point.p10,
    }));
}

function getSuccessPresentation(successRate: number): { label: string; className: string } {
    if (successRate >= 0.85) {
        return { label: "Higher modeled resilience", className: "text-success" };
    }
    if (successRate >= 0.6) {
        return { label: "Moderate modeled resilience", className: "text-warning" };
    }
    return { label: "Lower modeled resilience", className: "text-danger" };
}

export default function RetirementStressTestPage() {
    const [values, setValues] = useState<RetirementStressTestValues>({ ...defaultRetirementStressTestValues });
    const [touched, setTouched] = useState<Partial<Record<RetirementStressTestField, boolean>>>({});
    const [result, setResult] = useState<MonteCarloResult | null>(null);
    const [requiredSIP, setRequiredSIP] = useState<number | null>(null);
    const [running, setRunning] = useState(false);
    const [simulationError, setSimulationError] = useState<string | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const replyPortRef = useRef<MessagePort | null>(null);
    const runIdRef = useRef(0);

    const errors = validateRetirementStressTestForm(values);
    const parsedYearsToRetirement = Number(values.yearsToRetirement);
    const fanChartData = result ? getFanChartData(result) : [];

    useEffect(() => () => {
        runIdRef.current += 1;
        workerRef.current?.terminate();
        replyPortRef.current?.close();
    }, []);

    function cancelCurrentRun() {
        runIdRef.current += 1;
        workerRef.current?.terminate();
        replyPortRef.current?.close();
        workerRef.current = null;
        replyPortRef.current = null;
    }

    function updateField(field: RetirementStressTestField, value: string) {
        cancelCurrentRun();
        setValues((current) => ({ ...current, [field]: value }));
        setTouched((current) => ({ ...current, [field]: true }));
        setResult(null);
        setRequiredSIP(null);
        setRunning(false);
        setSimulationError(null);
    }

    function touchField(field: RetirementStressTestField) {
        setTouched((current) => ({ ...current, [field]: true }));
    }

    function runSimulation() {
        cancelCurrentRun();
        setResult(null);
        setRequiredSIP(null);
        setSimulationError(null);

        const preparedResult = prepareRetirementStressTest(values);
        if (preparedResult.status === "error") {
            setSimulationError(preparedResult.message);
            return;
        }

        const runId = runIdRef.current;
        setRunning(true);

        try {
            const worker = new Worker(
                new URL("./retirementStressTest.worker.ts", import.meta.url),
                { type: "module" },
            );
            const channel = new MessageChannel();
            workerRef.current = worker;
            replyPortRef.current = channel.port1;

            const handleResponse = (response: SimulationResponse) => {
                if (runIdRef.current !== runId) return;
                worker.terminate();
                channel.port1.close();
                workerRef.current = null;
                replyPortRef.current = null;
                setRunning(false);

                if (response.status === "success" && response.result) {
                    setResult(response.result);
                    setRequiredSIP(preparedResult.prepared.requiredMonthlySIP);
                } else {
                    setSimulationError(response.message ?? "The retirement simulation could not be completed.");
                }
            };

            channel.port1.onmessage = (event: MessageEvent<SimulationResponse>) => handleResponse(event.data);
            channel.port1.onmessageerror = () => {
                if (runIdRef.current !== runId) return;
                worker.terminate();
                channel.port1.close();
                workerRef.current = null;
                replyPortRef.current = null;
                setRunning(false);
                setSimulationError("The simulation returned data that could not be read. Please try again.");
            };
            worker.onerror = (event) => {
                event.preventDefault();
                if (runIdRef.current !== runId) return;
                worker.terminate();
                channel.port1.close();
                workerRef.current = null;
                replyPortRef.current = null;
                setRunning(false);
                setSimulationError("The simulation worker failed to start. Please try again.");
            };
            worker.postMessage({
                params: preparedResult.prepared.params,
                iterations: preparedResult.prepared.iterations,
            }, [channel.port2]);
        } catch (error) {
            workerRef.current?.terminate();
            replyPortRef.current?.close();
            workerRef.current = null;
            replyPortRef.current = null;
            setRunning(false);
            setSimulationError(error instanceof Error
                ? `Could not start the simulation: ${error.message}`
                : "Could not start the simulation. Please try again.");
        }
    }

    const formIsValid = Object.keys(errors).length === 0;
    const successPresentation = result ? getSuccessPresentation(result.successRate) : null;
    const medianDepletionYears = result?.medianDepletionYear === null || result?.medianDepletionYear === undefined
        ? null
        : Math.max(0, result.medianDepletionYear - parsedYearsToRetirement);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-3xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Finance Calculators
                </p>
                <h1 className="text-2xl font-bold text-main">Retirement Stress Test</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Test the Retirement Corpus plan against thousands of randomized return paths to see how sequence-of-returns risk could affect its chance of lasting.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.5fr)]">
                <form
                    aria-label="Retirement stress test assumptions"
                    className="space-y-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        runSimulation();
                    }}
                >
                    {fieldGroups.map((group) => (
                        <fieldset key={group.title} className="min-w-0 border-t border-border-subtle pt-5">
                            <legend className="mb-4 pr-3 text-sm font-semibold text-main">{group.title}</legend>
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
                                {group.title === "Return, inflation, and tax assumptions" && (
                                    <SimulationCountField
                                        value={values.simulationCount}
                                        error={errors.simulationCount && (touched.simulationCount || values.simulationCount.trim())
                                            ? errors.simulationCount
                                            : undefined}
                                        onChange={(event) => updateField("simulationCount", event.currentTarget.value)}
                                        onBlur={() => touchField("simulationCount")}
                                    />
                                )}
                            </div>
                        </fieldset>
                    ))}

                    <Button
                        type="submit"
                        disabled={!formIsValid || running}
                        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {running ? "Running simulation…" : "Run Simulation"}
                    </Button>
                    <p className="text-xs leading-5 text-muted">
                        Success-rate colors: green ≥85%, amber 60–84.9%, red &lt;60%. These are visual guideposts, not financial advice.
                    </p>
                </form>

                <section aria-label="Retirement stress test results" className="min-w-0 space-y-5">
                    {simulationError && (
                        <p role="alert" className="rounded-md border border-danger/50 bg-danger-surface px-4 py-3 text-sm leading-6 text-danger">
                            {simulationError}
                        </p>
                    )}
                    {running && (
                        <Card className="border-border-subtle bg-surface p-6">
                            <p role="status" className="text-sm text-muted">
                                Running {Number(values.simulationCount).toLocaleString("en-IN")} randomized futures in a background worker…
                            </p>
                        </Card>
                    )}
                    {result && successPresentation && (
                        <>
                            <Card className="border-border-subtle bg-surface p-6">
                                <p className={cnClassNames("text-xs font-semibold uppercase tracking-wide", successPresentation.className)}>
                                    {successPresentation.label}
                                </p>
                                <h2
                                    role="status"
                                    aria-live="polite"
                                    className={cnClassNames("mt-3 text-2xl font-bold leading-tight sm:text-3xl", successPresentation.className)}
                                >
                                    {(result.successRate * 100).toFixed(1)}% of simulated futures had your money last the full {values.drawdownYears} years
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-muted">
                                    Based on {result.iterations.toLocaleString("en-IN")} randomized paths and a required month-one SIP of {formatCurrency(requiredSIP ?? 0)} with a {values.stepUpRatePercent}% annual step-up.
                                </p>
                                {result.successRate < 1 && medianDepletionYears !== null && (
                                    <p className="mt-3 rounded-md bg-warning-surface px-3 py-2 text-sm leading-6 text-warning">
                                        Among paths that depleted, the median depletion point was around {medianDepletionYears} {medianDepletionYears === 1 ? "year" : "years"} into retirement.
                                    </p>
                                )}
                            </Card>

                            <Card className="min-w-0 border-border-subtle bg-surface p-5 sm:p-6">
                                <h2 className="text-base font-semibold text-main">Projected corpus range over time</h2>
                                <p className="mt-2 text-sm leading-6 text-muted">
                                    The shaded band spans the 10th–90th percentile; the median is shown as a separate line. The vertical marker shows when withdrawals begin.
                                </p>
                                <div
                                    role="img"
                                    aria-label="Responsive fan chart of the 10th, median, and 90th percentile corpus balances, with retirement year marked"
                                    className="mt-4 h-80 w-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={fanChartData} margin={{ top: 10, right: 12, bottom: 8, left: 8 }} accessibilityLayer>
                                            <CartesianGrid stroke="var(--theme-border-subtle)" strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="year"
                                                type="number"
                                                domain={[0, "dataMax"]}
                                                allowDecimals={false}
                                                tick={{ fill: "var(--theme-muted)", fontSize: 12 }}
                                                tickLine={{ stroke: "var(--theme-border-subtle)" }}
                                                axisLine={{ stroke: "var(--theme-border-subtle)" }}
                                                label={{ value: "Year from today", position: "insideBottom", offset: -4, fill: "var(--theme-muted)" }}
                                            />
                                            <YAxis
                                                domain={[0, "auto"]}
                                                tickFormatter={formatCompactCurrency}
                                                tick={{ fill: "var(--theme-muted)", fontSize: 12 }}
                                                tickLine={{ stroke: "var(--theme-border-subtle)" }}
                                                axisLine={{ stroke: "var(--theme-border-subtle)" }}
                                                width={76}
                                            />
                                            <ReferenceLine
                                                x={parsedYearsToRetirement}
                                                stroke="var(--theme-warning)"
                                                strokeDasharray="5 4"
                                                label={{ value: "Retirement", fill: "var(--theme-warning)", fontSize: 11 }}
                                            />
                                            <Tooltip
                                                content={<FanChartTooltip />}
                                                contentStyle={{
                                                    backgroundColor: "var(--theme-surface)",
                                                    borderColor: "var(--theme-border-subtle)",
                                                    borderRadius: "0.5rem",
                                                }}
                                            />
                                            <Area dataKey="bandStart" stackId="fan" stroke="none" fill="transparent" isAnimationActive={false} tooltipType="none" />
                                            <Area dataKey="bandRange" stackId="fan" stroke="none" fill="var(--theme-info)" fillOpacity={0.18} isAnimationActive={false} tooltipType="none" />
                                            <Line dataKey="p10" name="10th percentile" stroke="var(--theme-info)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                                            <Line dataKey="p50" name="Median" stroke="var(--theme-primary)" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            <Line dataKey="p90" name="90th percentile" stroke="var(--theme-success)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted" aria-label="Fan chart series">
                                    <li><span className="mr-2 inline-block h-0.5 w-4 align-middle bg-info" />10th percentile</li>
                                    <li><span className="mr-2 inline-block h-0.5 w-4 align-middle bg-primary" />Median</li>
                                    <li><span className="mr-2 inline-block h-0.5 w-4 align-middle bg-success" />90th percentile</li>
                                </ul>
                                <p className="sr-only">
                                    {result.fanChartData.map((point) => (
                                        `Year ${point.year}: 10th percentile ${formatCurrency(point.p10)}, median ${formatCurrency(point.p50)}, 90th percentile ${formatCurrency(point.p90)}. `
                                    ))}
                                </p>
                            </Card>

                            <Card className="border-border-subtle bg-surface p-5 sm:p-6">
                                <h2 className="text-base font-semibold text-main">Corpus at retirement</h2>
                                <p className="mt-2 text-sm leading-6 text-muted">
                                    Spread across simulated paths after applying the one-time tax haircut.
                                </p>
                                <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                                    {percentileKeys.map(([key, label]) => (
                                        <div key={key} className="min-w-0 rounded-md border border-border-subtle bg-canvas p-3">
                                            <dt className="text-xs font-medium text-muted">{label}</dt>
                                            <dd className="mt-1 break-words text-sm font-semibold text-main">
                                                {formatCurrency(result.corpusAtRetirementPercentiles[key])}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </Card>
                        </>
                    )}
                    {!running && !result && !simulationError && (
                        <Card className="border-border-subtle bg-surface p-6">
                            <h2 className="text-base font-semibold text-main">Ready to stress-test your plan</h2>
                            <p className="mt-2 text-sm leading-6 text-muted">
                                Adjust the assumptions, then run the simulation. Your required SIP is calculated from the fixed-duration retirement target before the randomized paths are tested.
                            </p>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
}

interface NumberFieldProps {
    name: Exclude<RetirementStressTestField, "simulationCount">;
    label: string;
    suffix: string;
    hint?: string;
    value: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

function NumberField({ name, label, suffix, hint, value, error, onChange, onBlur }: NumberFieldProps) {
    const inputId = `retirement-stress-test-${name}`;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-semibold text-main">{label}</label>
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

function SimulationCountField({
    value,
    error,
    onChange,
    onBlur,
}: {
    value: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    onBlur: () => void;
}) {
    const inputId = "retirement-stress-test-simulationCount";
    const errorId = `${inputId}-error`;

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-semibold text-main">Number of Simulations</label>
            <select
                id={inputId}
                name="simulationCount"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={cnClassNames(
                    "min-h-11 w-full rounded-md border bg-canvas px-3 py-2 text-sm text-main outline-none focus:ring-2 focus:ring-focus",
                    error ? "border-danger" : "border-border-subtle",
                )}
            >
                {[500, 1000, 2000, 5000, 10000].map((count) => (
                    <option key={count} value={count}>{count.toLocaleString("en-IN")}</option>
                ))}
            </select>
            <p className="text-xs leading-5 text-muted">More simulations can improve stability but take longer; maximum 10,000.</p>
            {error && <p id={errorId} className="text-xs leading-5 text-danger">{error}</p>}
        </div>
    );
}

function FanChartTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ payload?: FanChartPoint }>;
}) {
    const point = payload?.find((entry) => entry.payload)?.payload;
    if (!active || !point) return null;

    return (
        <div className="rounded-md border border-border-subtle bg-surface px-3 py-2 text-xs shadow-lg">
            <p className="mb-1 font-semibold text-main">Year {point.year}</p>
            <p className="text-info">10th percentile: {formatCurrency(point.p10)}</p>
            <p className="text-primary">Median: {formatCurrency(point.p50)}</p>
            <p className="text-success">90th percentile: {formatCurrency(point.p90)}</p>
        </div>
    );
}
