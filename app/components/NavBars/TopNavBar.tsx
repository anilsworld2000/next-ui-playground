"use client";
import Link from "next/link";
import { useSelectedRoute } from "../../hooks/CurrentRoute";
import { useSelectedDashboard } from "../../hooks/SelectedDashboardContext";
import HorizontalNavBar from "./HorizontalNavBar";
import { NavItem } from "@/app/types";
import ThemeButton from "../Buttons/ThemeButton";
import cnClassNames from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";

function navBarItems(): NavItem[] {
    return [
        {
            id: '_theme',
            name: 'Theme',
            href: '#',
            icon: ThemeButton(),
        },
        {
            id: "_login",
            name: "Login",
            href: '/login',
            icon: <span>Login</span>
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
            <div className="z-30">
                <Link href="./" className={cnClassNames(theme.theme.primaryText, "text-lg font-extrabold")}>Home</Link>
                {routes.map((route) => {
                    if (route.length <= 2) return null;
                    const segment = route.split("/").filter(Boolean).slice(-1)[0];
                    const label = `/${segment}`;

                    return (
                        <Link
                            href={route}
                            key={route}
                            className={cnClassNames(theme.theme.primaryText, "text-sm ml-4")}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            {/* Centered H1 */}
            <h1 className={cnClassNames(
                theme.theme.textMain,
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm pointer-events-none"
            )}>
                {selectedDashboard}
            </h1>

            {/* Right Section */}
            <div className="z-30">
                <HorizontalNavBar
                    items={navBarItems()}
                    addUserSection={false}
                />
            </div>
        </nav>

    );
}