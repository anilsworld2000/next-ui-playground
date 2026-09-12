"use client";

import { notFound } from "next/navigation";
import Card from "@/app/components/Cards/Card";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";
import { categories, godNames } from "../data";

interface DevotionalGodPageProps {
    params: { god: string };
}

export default function DevotionalGodPage({ params }: DevotionalGodPageProps) {
    const { theme } = useTheme();
    const god = params.god.toLowerCase();

    if (!godNames.includes(god)) {
        notFound();
    }

    return (
        <div className={cnClassNames(theme.bg, theme.textMain, "p-4")}>
            <h1 className="text-xl font-semibold mb-4">{god.toUpperCase()}</h1>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {categories.map((category) => (
                    <Card
                        key={category}
                        href={`/devotional/${god}/${category}`}
                        ariaLabel={`Open ${category} for ${god}`}
                        className={cnClassNames(
                            theme.card,
                            theme.border,
                            theme.hoverText,
                            "rounded-lg border p-4 transition hover:shadow-md"
                        )}
                    >
                        {category.toUpperCase()}
                    </Card>
                ))}
            </div>
        </div>
    );
}