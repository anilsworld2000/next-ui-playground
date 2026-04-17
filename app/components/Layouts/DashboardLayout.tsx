// components/DashboardLayout.tsx
import { ReactNode } from "react";
import VerticalNavbar from "../NavBars/VerticalNavBar";
import { NavGroup, NavItem, UserSectionPosition } from "@/app/types";
import HorizontalNavBar from "../NavBars/HorizontalNavBar";

interface DashboardLayoutProps {
    children: ReactNode;
    horizontalItems: NavItem[]; // type NavGroup[] if you want strict typing
    verticalNavbarTitle: string;
    verticalNavbarIcon?: React.ReactNode;
    verticalGroups: NavGroup[]; // type NavGroup[] if you want strict typing
    userSectionPosition: UserSectionPosition; // Optional prop to pass user info to UserSection
}

export default function DashboardLayout({ children, horizontalItems, verticalNavbarTitle, verticalNavbarIcon, verticalGroups, userSectionPosition }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            {/* First column: vertical nav bar */}
            <VerticalNavbar
                title={verticalNavbarTitle}
                icon={verticalNavbarIcon}
                groups={verticalGroups}
                addUserSection={userSectionPosition === UserSectionPosition.Vertical}
            />

            {/* Second column: split into two rows */}
            <div className="flex flex-col flex-1">
                {/* Row 1: horizontal nav bar */}
                <div className="">
                    <HorizontalNavBar items={horizontalItems}
                        addUserSection={userSectionPosition === UserSectionPosition.Horizontal}
                    />
                </div>

                {/* Row 2: children content */}
                <main className="flex-1 pl-1">
                    {children}
                </main>
            </div>
        </div>
    );
}