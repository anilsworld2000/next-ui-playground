import type { ReactNode } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { UserSectionPosition } from "../types/navigation";

export default function GamesLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={[]}
            verticalNavbarTitle="Games"
            verticalGroups={[]}
            userSectionPosition={UserSectionPosition.Undefined}
        >
            {children}
        </DashboardLayout>
    );
}
