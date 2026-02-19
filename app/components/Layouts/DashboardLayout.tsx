// components/DashboardLayout.tsx
import { ReactNode } from "react";
import VerticalNavbar from "../NavBars/VerticalNavBar";
import { NavGroup, NavItem } from "@/app/types";
import HorizontalNavBar from "../NavBars/HorizontalNavBar";

type UserSectionType = {
    name: string;
    email?: string;
    avatarUrl?: string;
    isVertical?: boolean;
};

interface DashboardLayoutProps {
    children: ReactNode;
    horizontalItems: NavItem[]; // type NavGroup[] if you want strict typing
    verticalNavbarTitle: string;
    verticalNavbarIcon?: React.ReactNode;
    verticalGroups: NavGroup[]; // type NavGroup[] if you want strict typing
    UserSectionType?: UserSectionType; // Optional prop to pass user info to UserSection
}

export default function DashboardLayout({ children, horizontalItems, verticalNavbarTitle, verticalNavbarIcon, verticalGroups, UserSectionType }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            {/* First column: vertical nav bar */}
            <VerticalNavbar
                title={verticalNavbarTitle}
                icon={verticalNavbarIcon}
                groups={verticalGroups}
                addUserSection={!!UserSectionType?.isVertical} // Pass boolean to control UserSection rendering
            />

            {/* Second column: split into two rows */}
            <div className="flex flex-col flex-1">
                {/* Row 1: horizontal nav bar */}
                <div className="">
                    <HorizontalNavBar items={horizontalItems}
                    addUserSection={!!!UserSectionType?.isVertical} // Pass boolean to control UserSection rendering
                    />
                </div>

                {/* Row 2: children content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}