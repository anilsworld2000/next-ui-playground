import { ReactNode } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { readingNavigation } from "./navigation";

export default function ReadingLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={readingNavigation.horizontalItems ?? []}
            verticalNavbarTitle={readingNavigation.title}
            verticalNavbarIcon={readingNavigation.icon}
            verticalGroups={readingNavigation.groups}
            userSectionPosition={readingNavigation.userSectionPosition}
        >
            {children}
        </DashboardLayout>
    );
}