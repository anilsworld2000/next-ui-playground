// components/DashboardLayout.tsx
import { ReactNode } from "react";
import VerticalNavbar from "../NavBars/VerticalNavBar";
import { NavGroup, NavItem } from "@/app/types";
import HorizontalNavBar from "../NavBars/HontalNavBar";

interface DashboardLayoutProps {
    children: ReactNode;
    horizontalItems: NavItem[]; // type NavGroup[] if you want strict typing
    verticalGroups: NavGroup[]; // type NavGroup[] if you want strict typing
}

export default function DashboardLayout({ children, horizontalItems, verticalGroups }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            {/* First column: vertical nav bar */}
            <VerticalNavbar groups={verticalGroups} />

            {/* Second column: split into two rows */}
            <div className="flex flex-col flex-1">
                {/* Row 1: horizontal nav bar */}
                <div className="">
                    <HorizontalNavBar items={horizontalItems} />
                </div>

                {/* Row 2: children content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}