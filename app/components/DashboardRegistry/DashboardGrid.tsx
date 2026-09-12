"use client";

import { LayoutDashboard } from "lucide-react";
import Card from "../Cards/Card";
import { useTheme } from "../../hooks/ThemeContext";
import cnClassNames, { ICON_SIZES } from "../../utils";
import type { DashboardRoute } from "../../config/dashboardRegistry";

export default function DashboardGrid({ dashboards }: { dashboards: DashboardRoute[] }) {
    return (
        <div className={cnClassNames("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8")}>
            {dashboards.map((dashboard) => (
                <DashboardPreview key={dashboard.id} dashboard={dashboard} />
            ))}
        </div>
    );
}

function DashboardPreview({ dashboard }: { dashboard: DashboardRoute }) {
    const theme = useTheme();

    return (
        <Card
            href={dashboard.path}
            ariaLabel={`Navigate to ${dashboard.name}`}
            className={cnClassNames(theme.theme.card, theme.theme.border, theme.theme.hoverText, "group rounded-2xl shadow-md border overflow-hidden hover:shadow-lg transition")}
        >
            <div className="relative h-48 overflow-hidden flex items-center justify-center">
                <LayoutDashboard size={ICON_SIZES.xlg} strokeWidth={1} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-4" role="region" aria-labelledby={`dash-${dashboard.id}`}>
                <h3 id={`dash-${dashboard.id}`} className="text-lg font-semibold">{dashboard.name}</h3>
                <p className={cnClassNames("text-xs mt-1", theme.theme.textMuted)}>{dashboard.description}</p>
            </div>
        </Card>
    );
}