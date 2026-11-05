import type { ReactNode } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { financeCalculatorsNavigation } from "./navigation";

export default function FinanceCalculatorsLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={financeCalculatorsNavigation.horizontalItems ?? []}
            verticalNavbarTitle={financeCalculatorsNavigation.title}
            verticalNavbarIcon={financeCalculatorsNavigation.icon}
            verticalGroups={financeCalculatorsNavigation.groups}
            userSectionPosition={financeCalculatorsNavigation.userSectionPosition}
        >
            {children}
        </DashboardLayout>
    );
}