"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HorizontalNavBar from "./HorizontalNavBar";
import type { NavItem } from "@/app/types/navigation";
import ThemeButton from "../Buttons/ThemeButton";
import cnClassNames from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";
import { getDashboardTitle } from "../../config/dashboardRegistry";

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
    const pathname = usePathname();
    const theme = useTheme();
    const routes = pathname
        ? pathname.split("/").filter(Boolean).map((_, index, segments) => `/${segments.slice(0, index + 1).join("/")}`)
        : [];
    const dashboardTitle = pathname ? getDashboardTitle(pathname) : "";

    return (
        <nav className={cnClassNames(
            "relative flex min-h-12 flex-row items-center justify-between gap-4 rounded-lg border px-3 shadow-sm",
            theme.theme.card,
            theme.theme.border
        )}>
            {/* Left Section */}
            <div className="z-30 flex min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap">
                <Link href="./" className={cnClassNames(theme.theme.primaryText, "text-sm font-bold tracking-wide")}>Home</Link>
                {routes.map((route) => {
                    if (route.length <= 2) return null;
                    const segment = route.split("/").filter(Boolean).slice(-1)[0];
                    const label = segment.replace(/-/g, " ");

                    return (
                        <Link
                            href={route}
                            key={route}
                            className={cnClassNames(theme.theme.textMuted, theme.theme.hoverText, "text-xs capitalize transition-colors")}
                        >
                            / {label}
                        </Link>
                    );
                })}
            </div>

            {/* Centered H1 */}
            <h1 className={cnClassNames(
                theme.theme.textMain,
                "pointer-events-none absolute left-1/2 top-1/2 hidden max-w-[35%] -translate-x-1/2 -translate-y-1/2 truncate text-xs font-semibold capitalize tracking-wide sm:block"
            )}>
                {dashboardTitle}
            </h1>

            {/* Right Section */}
            <div className="z-30 shrink-0">
                <HorizontalNavBar
                    items={navBarItems()}
                    addUserSection={false}
                />
            </div>
        </nav>

    );
}