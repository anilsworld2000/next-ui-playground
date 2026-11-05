"use client";

import { useDeferredValue, useState, type ChangeEvent } from "react";
import Card from "../../components/Cards/Card";
import cnClassNames from "../../utils";
import { formatCurrency } from "../formatCurrency";
import {
    calculateFutureValue,
    validateFutureValueForm,
    type FutureValueField,
    type FutureValueFormValues,
    type FutureValueMode,
} from "./futureValueModel";

interface CalculatorFormState {
    mode: FutureValueMode;
    values: FutureValueFormValues;
}

interface FieldConfig {
    name: FutureValueField;
    label: string;
    suffix: string;
    hint: string;
}

const initialFormState: CalculatorFormState = {
    mode: "lump-sum",
    values: {
        presentValue: "",
        monthlyAmount: "",
        annualReturnPercent: "",
        annualStepUpPercent: "",
        years: "",
    },
};

const modeOptions: { value: FutureValueMode; label: string }[] = [
    { value: "lump-sum", label: "Lump Sum" },
    { value: "monthly-sip", label: "Monthly SIP" },
    { value: "step-up-sip", label: "Step-up SIP" },
];

const fieldsByMode: Record<FutureValueMode, FieldConfig[]> = {
    "lump-sum": [
        { name: "presentValue", label: "Present Value", suffix: "₹", hint: "Enter the amount invested today." },
        { name: "annualReturnPercent", label: "Expected Annual Return", suffix: "%", hint: "Allowed range: -100% to 100%." },
        { name: "years", label: "Years", suffix: "years", hint: "Enter a duration greater than zero." },
    ],
    "monthly-sip": [
        { name: "monthlyAmount", label: "Monthly Amount", suffix: "₹", hint: "Enter the amount invested each month." },
        { name: "annualReturnPercent", label: "Expected Annual Return", suffix: "%", hint: "Allowed range: -100% to 100%." },
        { name: "years", label: "Years", suffix: "years", hint: "Enter a duration greater than zero." },
    ],
    "step-up-sip": [
        { name: "monthlyAmount", label: "Monthly Amount in Year 1", suffix: "₹", hint: "Enter the first year's monthly investment." },
        { name: "annualReturnPercent", label: "Expected Annual Return", suffix: "%", hint: "Allowed range: -100% to 100%; zero is not supported for Step-up SIP." },
        { name: "annualStepUpPercent", label: "Annual Step-up", suffix: "%", hint: "Allowed range: -100% to 100%." },
        { name: "years", label: "Years", suffix: "years", hint: "Fractional years are supported." },
    ],
};

export default function FutureValuePage() {
    const [form, setForm] = useState(initialFormState);
    const [touched, setTouched] = useState<Partial<Record<FutureValueField, boolean>>>({});
    const deferredForm = useDeferredValue(form);
    const errors = validateFutureValueForm(form.mode, form.values);
    const deferredErrors = validateFutureValueForm(deferredForm.mode, deferredForm.values);
    const isUpdating = deferredForm !== form;
    const result = isUpdating || Object.keys(deferredErrors).length > 0
        ? null
        : calculateFutureValue(deferredForm.mode, deferredForm.values);

    function updateMode(mode: FutureValueMode) {
        setForm((current) => ({ ...current, mode }));
    }

    function updateField(field: FutureValueField, value: string) {
        setForm((current) => ({
            ...current,
            values: { ...current.values, [field]: value },
        }));
        setTouched((current) => ({ ...current, [field]: true }));
    }

    function touchField(field: FutureValueField) {
        setTouched((current) => ({ ...current, [field]: true }));
    }

    const visibleFields = fieldsByMode[form.mode];

    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Finance Calculators
                </p>
                <h1 className="text-2xl font-bold text-main">Future Value</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Estimate how a lump sum or monthly investment may grow over time.
                </p>
            </header>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
                <section aria-labelledby="investment-mode-heading" className="min-w-0">
                    <h2 id="investment-mode-heading" className="mb-3 text-sm font-semibold text-main">
                        Investment mode
                    </h2>
                    <div role="radiogroup" aria-labelledby="investment-mode-heading" className="flex w-full gap-1 rounded-lg border border-border-subtle bg-surface p-1">
                        {modeOptions.map((option) => (
                            <label key={option.value} className="relative min-w-0 flex-1 cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    type="radio"
                                    name="investment-mode"
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
                    </div>

                    <form
                        className="mt-7 space-y-5"
                        aria-label={`${modeOptions.find(({ value }) => value === form.mode)?.label} inputs`}
                        onSubmit={(event) => event.preventDefault()}
                    >
                        {visibleFields.map((field) => {
                            const error = errors[field.name];
                            const showError = Boolean(error && (touched[field.name] || form.values[field.name].trim()));

                            return (
                                <NumberField
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    suffix={field.suffix}
                                    hint={field.hint}
                                    value={form.values[field.name]}
                                    error={showError ? error : undefined}
                                    onChange={(event) => updateField(field.name, event.currentTarget.value)}
                                    onBlur={() => touchField(field.name)}
                                />
                            );
                        })}
                    </form>
                </section>

                <section aria-label="Future value result" aria-live="polite" aria-atomic="true">
                    <Card className="min-h-64 border-border-subtle bg-surface p-6">
                        <p className="text-sm font-medium text-muted">Future Value</p>
                        {isUpdating ? (
                            <p className="mt-5 text-sm text-muted">Updating estimate…</p>
                        ) : result ? (
                            <>
                                <p className="mt-2 break-words text-3xl font-bold text-main">
                                    {formatCurrency(result.futureValue)}
                                </p>
                                <p className="mt-5 border-t border-border-subtle pt-4 text-sm leading-6 text-muted">
                                    You’ll invest a total of {formatCurrency(result.totalInvested)} over {deferredForm.values.years} years, growing to {formatCurrency(result.futureValue)}.
                                </p>
                            </>
                        ) : (
                            <p className="mt-5 text-sm leading-6 text-muted">
                                Enter valid values to see your estimate.
                            </p>
                        )}
                    </Card>
                </section>
            </div>
        </div>
    );
}

interface NumberFieldProps {
    name: FutureValueField;
    label: string;
    suffix: string;
    hint: string;
    value: string;
    error?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
}

function NumberField({ name, label, suffix, hint, value, error, onChange, onBlur }: NumberFieldProps) {
    const inputId = `future-value-${name}`;
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
