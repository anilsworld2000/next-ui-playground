"use client";

export default function CalculatorPlaceholder({ title }: { title: string }) {
    return (
        <section className="mx-auto w-full max-w-5xl px-4 pb-10 pt-8 sm:px-6" aria-labelledby="calculator-title">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Finance Calculators
            </p>
            <h1 id="calculator-title" className="text-2xl font-bold text-main">
                {title}
            </h1>
            <p className="mt-4 text-sm text-muted">Coming soon</p>
        </section>
    );
}