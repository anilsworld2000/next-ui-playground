"use client";

import { LayoutDashboard } from "lucide-react";
import Card from "../Cards/Card";
import { useTheme } from "../../hooks/ThemeContext";
import cnClassNames, { ICON_SIZES } from "../../utils";
import type { DashboardRoute } from "../../config/dashboardRegistry";

export default function DashboardGrid({ dashboards }: { dashboards: DashboardRoute[] }) {
    return (
        <div className={cnClassNames("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3")}>
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
            className={cnClassNames(theme.theme.card, theme.theme.border, theme.theme.hoverText, "group overflow-hidden rounded-lg border shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg")}
        >
            <div className={cnClassNames("flex h-36 items-center justify-center border-b transition-colors", theme.theme.accent, theme.theme.border)}>
                <LayoutDashboard className={cnClassNames(theme.theme.primaryText, "transition-transform duration-200 group-hover:scale-110")} size={ICON_SIZES.xlg} strokeWidth={1.25} />
            </div>

            <div className="p-5" role="region" aria-labelledby={`dash-${dashboard.id}`}>
                <h3 id={`dash-${dashboard.id}`} className="text-base font-semibold tracking-tight">{dashboard.name}</h3>
                <p className={cnClassNames("mt-2 text-xs leading-5", theme.theme.textMuted)}>{dashboard.description}</p>
            </div>
        </Card>
    );
}