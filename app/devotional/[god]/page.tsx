"use client";

import { notFound } from "next/navigation";
import Card from "@/app/components/Cards/Card";
import { categories, godNames } from "../data";

interface DevotionalGodPageProps {
    params: { god: string };
}

export default function DevotionalGodPage({ params }: DevotionalGodPageProps) {
    const god = params.god.toLowerCase();

    if (!godNames.includes(god)) {
        notFound();
    }

    return (
        <div className="bg-canvas p-4 text-main">
            <h1 className="text-xl font-semibold mb-4">{god.toUpperCase()}</h1>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {categories.map((category) => (
                    <Card
                        key={category}
                        href={`/devotional/${god}/${category}`}
                        ariaLabel={`Open ${category} for ${god}`}
                        className="rounded-lg border border-border-subtle bg-surface p-4 text-main transition hover:text-link-hover hover:shadow-md"
                    >
                        {category.toUpperCase()}
                    </Card>
                ))}
            </div>
        </div>
    );
}