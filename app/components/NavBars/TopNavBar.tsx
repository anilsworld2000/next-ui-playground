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
        <nav
            className="flex flex-row justify-between"
        >
            <div>
                <Link href="./" className={cnClassNames(theme.theme.primaryText, "text-lg font-extrabold")}>Home</Link>
                {routes.map((route) => (
                    route.length > 2 &&
                    <Link
                            href={route}
                            key={route}
                            className={cnClassNames(theme.theme.primaryText, "text-sm")}>
                        {"\t" + route[0] + route.charAt(1).toUpperCase() + route.slice(2)}
                    </Link>
                ))}
            </div>
            <h1 className={cnClassNames(theme.theme.textMain, "text-sm items-center")}>{selectedDashboard}</h1>
            <HorizontalNavBar
                items={navBarItems()}>
            </HorizontalNavBar>
        </nav>);
}