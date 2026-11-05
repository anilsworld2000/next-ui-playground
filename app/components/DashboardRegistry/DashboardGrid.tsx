"use client";

import { LayoutDashboard } from "lucide-react";
import Card from "../Cards/Card";
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
    return (
        <Card
            href={dashboard.path}
            ariaLabel={`Navigate to ${dashboard.name}`}
            className="group overflow-hidden rounded-lg border border-border-subtle bg-surface text-main shadow-sm transition duration-200 hover:-translate-y-0.5 hover:text-link-hover hover:shadow-lg"
        >
            <div className="flex h-36 items-center justify-center border-b border-border-subtle bg-accent transition-colors">
                <LayoutDashboard className="text-link transition-transform duration-200 group-hover:scale-110" size={ICON_SIZES.xlg} strokeWidth={1.25} />
            </div>

            <div className="p-5" role="region" aria-labelledby={`dash-${dashboard.id}`}>
                <h3 id={`dash-${dashboard.id}`} className="text-base font-semibold tracking-tight">{dashboard.name}</h3>
                <p className="mt-2 text-xs leading-5 text-muted">{dashboard.description}</p>
            </div>
        </Card>
    );
}