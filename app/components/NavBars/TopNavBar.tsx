"use client";
import Link from "next/link";
import { useSelectedRoute } from "../../hooks/CurrentRoute";
import { useSelectedDashboard } from "../../hooks/SelectedDashboardContext";
import HorizontalNavBar from "./HontalNavBar";
import { NavItem } from "@/app/types";
import ThemeButton from "../Buttons/ThemeButton";
import cnClassNames from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";

function navBarItems(): NavItem[] {
    return [
        {
            id: '_theme',
            name: 'Toggle Theme',
            href: '#',
            icon: ThemeButton(),
        },
        {
            id: "_login",
            name: "Login",
            href: '/login'
        },
    ];
}
export default function TopNavBar() {
    const { routes } = useSelectedRoute();
    const { selectedDashboard } = useSelectedDashboard();
    const theme = useTheme();

    return (
        <nav className="relative flex flex-row items-center justify-between">
            {/* Left Section */}
            <div className="z-10">
                <Link href="./" className={cnClassNames(theme.theme.primaryText, "text-lg font-extrabold")}>Home</Link>
                {routes.map((route) => (
                    route.length > 2 &&
                    <Link
                        href={route}
                        key={route}
                        className={cnClassNames(theme.theme.primaryText, "text-sm ml-4")}>
                        {route[0] + route.charAt(1).toUpperCase() + route.slice(2)}
                    </Link>
                ))}
            </div>

            {/* Centered H1 */}
            <h1 className={cnClassNames(
                theme.theme.textMain,
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm pointer-events-none"
            )}>
                {selectedDashboard}
            </h1>

            {/* Right Section */}
            <div className="z-10">
                <HorizontalNavBar items={navBarItems()} />
            </div>
        </nav>

    );
}