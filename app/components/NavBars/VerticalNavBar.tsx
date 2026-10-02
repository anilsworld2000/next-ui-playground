"use client";
import { useTheme } from "@/app/hooks/ThemeContext";
import type { NavGroup } from "@/app/types/navigation";
import cnClassNames, { ICON_SIZES } from "@/app/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../Buttons/Button";
import ToolTip from "../ToolTips/ToolTip";
import { ArrowRightIcon } from "lucide-react";
import UserSection from "../UserSections/UserSection";
import { useUser } from "@/app/hooks/UserContext";

interface VerticalNavbarProps {
    title: string;
    icon?: React.ReactNode;
    groups: NavGroup[];
    addUserSection: boolean;
    // Optional prop to include UserSection at the bottom
}

export function getSidebarClasses(isSidebarOpen: boolean, baseClassName: string): string {
    return cnClassNames(
        baseClassName,
        "overflow-hidden rounded-t-xl transition-all duration-300 ease-in-out",
        "fixed left-0 top-2 z-50 h-[calc(100vh-4rem)]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:static lg:left-auto lg:top-auto lg:z-auto lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:rounded-none lg:sticky lg:top-2",
        isSidebarOpen ? "lg:w-64" : "lg:w-20",
    );
}

export default function VerticalNavbar(props: VerticalNavbarProps) {
    const theme = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const user = useUser();

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [pathname]);

    const handleNavClick = (href: string) => {
        router.push(href);
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {props.groups?.length > 0 && (
                <aside
                    aria-label="Sidebar navigation"
                    className={getSidebarClasses(isSidebarOpen, theme.theme.sidebar)}
                >
                    <div className="flex h-full flex-col">
                        <div className="flex shrink-0 items-center gap-3 p-4">
                            <Button
                                type="button"
                                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                                aria-expanded={isSidebarOpen}
                                className={cnClassNames("shrink-0 rounded-xl p-2", theme.theme.primary, !isSidebarOpen && "mx-auto")}
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                            >
                                {props.icon}
                            </Button>
                            {isSidebarOpen && (
                                <h1 className="truncate text-xl font-bold transition-opacity duration-300">
                                    {props.title}
                                </h1>
                            )}
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-hide">
                            {props.groups?.map((group) => (
                                <div key={group.id} className="py-2">
                                    {isSidebarOpen && (
                                        <div className="px-2 py-0 text-xs uppercase opacity-50">
                                            {group.title}
                                        </div>
                                    )}
                                    {group.items.map((item) => (
                                        <button
                                            type="button"
                                            key={item.id}
                                            onClick={() => handleNavClick(item.href)}
                                            className={cnClassNames(
                                                "group relative flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left transition-all",
                                                pathname === item.href ? theme.theme.primary : theme.theme.hoverBg,
                                                pathname === item.href ? "text-white" : "",
                                                !isSidebarOpen && "justify-center"
                                            )}
                                        >
                                            <span className="shrink-0 text-lg">{item.icon}</span>
                                            {isSidebarOpen ? (
                                                <span className="truncate font-medium">{item.name}</span>
                                            ) : (
                                                <ToolTip title={item.name} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </nav>

                        <div className="mt-auto shrink-0 border-t border-white/10 p-4">
                            {props.addUserSection && user.user && (
                                <UserSection
                                    name={user.user?.name}
                                    email={user.user?.email}
                                    avatarUrl={user.user?.avatarUrl}
                                    isCollapsed={!isSidebarOpen}
                                    layout="vertical"
                                />
                            )}

                            <button
                                type="button"
                                aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                                className={cnClassNames(
                                    "group relative flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-all",
                                    theme.theme.hoverBg,
                                    !isSidebarOpen && "justify-center"
                                )}
                            >
                                <span className={cnClassNames(
                                    "text-lg transition-transform duration-500",
                                    isSidebarOpen ? "rotate-180" : "rotate-0"
                                )}>
                                    <ArrowRightIcon size={ICON_SIZES.md} />
                                </span>

                                {isSidebarOpen ? (
                                    <span className="text-sm font-medium">Collapse Sidebar</span>
                                ) : (
                                    <ToolTip title="Expand Sidebar" />
                                )}
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {!isSidebarOpen && (
                <div className="fixed bottom-6 left-6 z-50 lg:hidden">
                    <Button
                        type="button"
                        aria-label={props.title ? `Open ${props.title} navigation` : "Open navigation"}
                        className={cnClassNames("rounded-full p-4 shadow-lg", theme.theme.primary)}
                        onClick={() => setSidebarOpen(true)}
                    >
                        {props.icon}
                    </Button>
                </div>
            )}
        </>
    );
}