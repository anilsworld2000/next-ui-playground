"use client";

import { useDeferredValue, useState, type ChangeEvent } from "react";
import Card from "../../components/Cards/Card";
import cnClassNames from "../../utils";
import { formatCurrency } from "../formatCurrency";
import {
    calculateSIPPlannerResult,
    validateSIPPlannerForm,
    type SIPPlannerField,
    type SIPPlannerFormValues,
    type SIPPlannerMode,
} from "./sipPlannerModel";

interface SIPPlannerState {
    mode: SIPPlannerMode;
    values: SIPPlannerFormValues;
}

interface FieldConfig {
    name: SIPPlannerField;
    label: string;
    suffix: string;
    hint: string;
}

const initialFormState: SIPPlannerState = {
    mode: "fixed",
    values: {
        targetAmount: "",
        years: "",
        annualReturnPercent: "",
        stepUpRatePercent: "10",
    },
};

const modeOptions: { value: SIPPlannerMode; label: string }[] = [
    { value: "fixed", label: "Fixed SIP" },
    { value: "step-up", label: "Step-up SIP" },
];

const fieldsByMode: Record<SIPPlannerMode, FieldConfig[]> = {
    fixed: [
        { name: "targetAmount", label: "Target Amount", suffix: "₹", hint: "Enter the future amount you want to reach." },
        { name: "years", label: "Years", suffix: "years", hint: "Enter a duration greater than zero." },
        { name: "annualReturnPercent", label: "Expected Annual Return", suffix: "%", hint: "Allowed range: -100% to 100%." },
    ],
    "step-up": [
        { name: "targetAmount", label: "Target Amount", suffix: "₹", hint: "Enter the future amount you want to reach." },
        { name: "years", label: "Years", suffix: "years", hint: "Enter a duration greater than zero." },
        { name: "annualReturnPercent", label: "Expected Annual Return", suffix: "%", hint: "Allowed range: -100% to 100%; zero is not supported for Step-up SIP." },
        { name: "stepUpRatePercent", label: "Annual Step-up Rate", suffix: "%", hint: "Allowed range: -100% to 100%; the SIP increases once per year." },
    ],
};

export default function SIPPlannerPage() {
    const [form, setForm] = useState(initialFormState);
    const [touched, setTouched] = useState<Partial<Record<SIPPlannerField, boolean>>>({});
    const deferredForm = useDeferredValue(form);
    const errors = validateSIPPlannerForm(form.mode, form.values);
    const deferredErrors = validateSIPPlannerForm(deferredForm.mode, deferredForm.values);
    const isUpdating = deferredForm !== form;
    const result = isUpdating || Object.keys(deferredErrors).length > 0
        ? null
        : calculateSIPPlannerResult(deferredForm.mode, deferredForm.values);
    const visibleFields = fieldsByMode[form.mode];

    function updateMode(mode: SIPPlannerMode) {
        setForm((current) => ({ ...current, mode }));
    }

    function updateField(field: SIPPlannerField, value: string) {
        setForm((current) => ({
            ...current,
            values: { ...current.values, [field]: value },
        }));
        setTouched((current) => ({ ...current, [field]: true }));
    }

    function touchField(field: SIPPlannerField) {
        setTouched((current) => ({ ...current, [field]: true }));
    }

    const selectedMode = modeOptions.find(({ value }) => value === form.mode)?.label;
    const displayYears = Number(deferredForm.values.years);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Finance Calculators
                </p>
                <h1 className="text-2xl font-bold text-main">SIP Planner</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Work backwards from a target amount to estimate the monthly investment you need.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
                <section aria-labelledby="sip-mode-heading" className="min-w-0">
                    <h2 id="sip-mode-heading" className="mb-3 text-sm font-semibold text-main">
                        SIP type
                    </h2>
                    <fieldset className="flex w-full gap-1 rounded-lg border border-border-subtle bg-surface p-1">
                        <legend className="sr-only">SIP type</legend>
                        {modeOptions.map((option) => (
                            <label key={option.value} className="relative min-w-0 flex-1 cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    type="radio"
                                    name="sip-planner-mode"
                                    value={option.value}
                                    checked={form.mode === option.value}
                                    onChange={() => updateMode(option.value)}
                                />
                                <span className={cnClassNames(
                                    "flex min-h-10 items-center justify-center rounded-md px-2 text-center text-xs font-semibold transition-colors sm:text-sm",
                                    "text-muted",
                                    "peer-checked:bg-primary peer-checked:text-primary-foreground",
                                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                                )}>
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </fieldset>

                    <form
                        className="mt-7 space-y-5"
                        aria-label={`${selectedMode} inputs`}
                        onSubmit={(event) => event.preventDefault()}
                    >
                        {visibleFields.map((field) => {
                            const error = errors[field.name];
                            const rawValue = form.values[field.name];
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
                </section>

                <section aria-label="Required SIP result" aria-live="polite" aria-atomic="true">
                    <Card className="min-h-64 border-border-subtle bg-surface p-6">
                        <p className="text-sm font-medium text-muted">Required Monthly SIP</p>
                        {isUpdating ? (
                            <p className="mt-5 text-sm text-muted">Updating estimate…</p>
                        ) : result ? (
                            <>
                                <p className="mt-2 break-words text-3xl font-bold text-main">
                                    {formatCurrency(result.monthlyAmount)}
                                    <span className="ml-2 text-base font-medium text-muted">/ month</span>
                                </p>
                                <p className="mt-2 text-sm leading-6 text-muted">
                                    {form.mode === "step-up"
                                        ? "Starting monthly SIP in year 1"
                                        : "Fixed monthly SIP"}
                                </p>
                                <dl className="mt-6 space-y-3 border-t border-border-subtle pt-4 text-sm">
                                    <div className="flex items-start justify-between gap-4">
                                        <dt className="text-muted">Year 1 monthly SIP</dt>
                                        <dd className="text-right font-semibold text-main">
                                            {formatCurrency(result.yearOneMonthlyAmount)}
                                        </dd>
                                    </div>
                                    {form.mode === "step-up" && result.finalYearMonthlyAmount !== null && (
                                        <div className="flex items-start justify-between gap-4">
                                            <dt className="text-muted">Final-year monthly SIP</dt>
                                            <dd className="text-right font-semibold text-main">
                                                {formatCurrency(result.finalYearMonthlyAmount)}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between gap-4">
                                        <dt className="text-muted">Target amount</dt>
                                        <dd className="text-right font-semibold text-main">
                                            {formatCurrency(Number(deferredForm.values.targetAmount))}
                                        </dd>
                                    </div>
                                    <div className="flex items-start justify-between gap-4">
                                        <dt className="text-muted">Investment period</dt>
                                        <dd className="text-right font-semibold text-main">
                                            {displayYears} {displayYears === 1 ? "year" : "years"}
                                        </dd>
                                    </div>
                                </dl>
                            </>
                        ) : (
                            <p className="mt-5 text-sm leading-6 text-muted">
                                Enter valid values to see the monthly SIP needed to reach your target.
                            </p>
                        )}
                    </Card>
                </section>
            </div>
        </div>
    );
}

interface NumberFieldProps {
    name: SIPPlannerField;
    label: string;
    suffix: string;
    hint: string;
    value: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

function NumberField({ name, label, suffix, hint, value, error, onChange, onBlur }: NumberFieldProps) {
    const inputId = `sip-planner-${name}`;
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
