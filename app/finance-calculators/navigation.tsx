import { Activity, Calculator, ChartNoAxesCombined, PiggyBank, TrendingUp } from "lucide-react";
import type { DashboardNavigationConfig } from "../types/navigation";
import { UserSectionPosition } from "../types/navigation";
import { ICON_SIZES } from "../utils";

const iconSize = ICON_SIZES.lg;

export const financeCalculatorsNavigation: DashboardNavigationConfig = {
    title: "Finance Calculators",
    icon: <Calculator className="text-primary-foreground" size={ICON_SIZES.xlg} />,
    horizontalItems: [],
    groups: [
        {
            id: "calculators",
            title: "Calculators",
            items: [
                {
                    id: "future-value",
                    name: "Future Value",
                    icon: <TrendingUp size={iconSize} />,
                    href: "/finance-calculators/future-value",
                },
                {
                    id: "sip-planner",
                    name: "SIP Planner",
                    icon: <Activity size={iconSize} />,
                    href: "/finance-calculators/sip-planner",
                },
                {
                    id: "retirement-corpus",
                    name: "Retirement Corpus",
                    icon: <PiggyBank size={iconSize} />,
                    href: "/finance-calculators/retirement-corpus",
                },
                {
                    id: "retirement-stress-test",
                    name: "Retirement Stress Test",
                    icon: <ChartNoAxesCombined size={iconSize} />,
                    href: "/finance-calculators/retirement-stress-test",
                },
                {
                    id: "swp-simulator",
                    name: "SWP Simulator",
                    icon: <Calculator size={iconSize} />,
                    href: "/finance-calculators/swp-simulator",
                },
            ],
        },
    ],
    userSectionPosition: UserSectionPosition.Undefined,
};