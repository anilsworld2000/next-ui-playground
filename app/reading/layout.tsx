import { ReactNode } from "react";
import { BookOpen, FileText } from "lucide-react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import type { NavGroup } from "../types/navigation";
import { UserSectionPosition } from "../types/navigation";
import { ICON_SIZES } from "../utils";

const navGroups: NavGroup[] = [
    {
        id: "reading",
        title: "Reading",
        items: [
            {
                id: "open-document",
                name: "Open document",
                icon: <FileText size={ICON_SIZES.lg} />,
                href: "/reading",
            },
        ],
    },
];

export default function ReadingLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout
            horizontalItems={[]}
            verticalNavbarTitle="Reading"
            verticalNavbarIcon={<BookOpen className="text-white" size={ICON_SIZES.xlg} />}
            verticalGroups={navGroups}
            userSectionPosition={UserSectionPosition.Undefined}
        >
            {children}
        </DashboardLayout>
    );
}