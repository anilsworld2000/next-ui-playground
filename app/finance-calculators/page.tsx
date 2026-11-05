"use client";

import { Activity, Calculator, ChartNoAxesCombined, PiggyBank, TrendingUp } from "lucide-react";
import Card from "../components/Cards/Card";
import { ICON_SIZES } from "../utils";

const calculators = [
    {
        title: "Future Value",
        description: "Project how a lump-sum investment may grow over time.",
        href: "/finance-calculators/future-value",
        icon: TrendingUp,
    },
    {
        title: "SIP Planner",
        description: "Explore monthly investments, step-ups, and target contributions.",
        href: "/finance-calculators/sip-planner",
        icon: Activity,
    },
    {
        title: "Retirement Corpus",
        description: "Estimate a goal-date corpus for a finite or perpetual plan.",
        href: "/finance-calculators/retirement-corpus",
        icon: PiggyBank,
    },
    {
        title: "Retirement Stress Test",
        description: "Test a retirement plan against thousands of randomized return paths.",
        href: "/finance-calculators/retirement-stress-test",
        icon: ChartNoAxesCombined,
    },
    {
        title: "SWP Simulator",
        description: "Review a periodic withdrawal schedule and corpus depletion.",
        href: "/finance-calculators/swp-simulator",
        icon: Calculator,
    },
];

export default function FinanceCalculatorsPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Personal finance
                </p>
                <h1 className="text-3xl font-bold text-main">
                    Finance Calculators
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Choose a calculator to explore investment growth, retirement needs, or withdrawals.
                </p>
            </header>

            <section aria-label="Finance calculators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {calculators.map(({ title, description, href, icon: Icon }) => (
                    <Card
                        key={href}
                        href={href}
                        ariaLabel={`Open ${title} calculator`}
                        className="group flex min-h-52 flex-col border-border-subtle bg-surface text-main transition duration-200 hover:-translate-y-0.5 hover:text-link-hover hover:shadow-lg"
                    >
                        <span className="mb-6 flex size-11 items-center justify-center rounded-lg bg-accent">
                            <Icon className="text-link" size={ICON_SIZES.xlg} strokeWidth={1.7} />
                        </span>
                        <h2 className="text-base font-semibold text-main">{title}</h2>
                        <p className="mt-2 text-sm leading-5 text-muted">{description}</p>
                    </Card>
                ))}
            </section>
        </div>
    );
}