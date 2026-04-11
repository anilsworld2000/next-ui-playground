"use client";
import { useTheme } from "@/app/hooks/ThemeContext";
import { NavGroup } from "@/app/types";
import cnClassNames, { ICON_SIZES } from "@/app/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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

export default function VerticalNavbar(props: VerticalNavbarProps) {
    const theme = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const user = useUser();

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)} />
            )}

            {props.groups?.length > 0 &&
                <aside className={cnClassNames(
                    theme.theme.sidebar,
                    // 1. Changed h-screen to handle top-nav offset
                    // 2. Added overflow-hidden to the aside itself
                    "fixed lg:sticky top-16 left-0 z-50 h-[calc(100vh-4rem)] rounded-t-xl transition-all duration-300 ease-in-out overflow-hidden",
                    isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
                )}>
                    {/* The wrapper must be flex-col h-full to make the nav scrollable */}
                    <div className="flex flex-col h-full">

                        {/* Header: shrink-0 prevents it from squashing */}
                        <div className="p-4 flex items-center gap-3 shrink-0">
                            <Button className={cnClassNames("p-2 rounded-xl shrink-0", theme.theme.primary, !isSidebarOpen && "mx-auto")}
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                            >
                                {props.icon}
                            </Button>
                            {isSidebarOpen &&
                                <h1 className="text-xl font-bold truncate transition-opacity duration-300">
                                    {props.title}
                                </h1>
                            }
                        </div>

                        {/* NAV: This is the ONLY part that should scroll */}
                        {/* Use overflow-y-auto and ensure it takes available space */}
                        <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                            {props.groups?.map((group) => (
                                <div key={group.id} className="py-2">
                                    {isSidebarOpen && (
                                        <div className="px-2 py-2 text-xs uppercase opacity-50">
                                            {group.title}
                                        </div>
                                    )}
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                router.push(item.href);
                                                if (window.innerWidth < 1024) setSidebarOpen(false);
                                            }}
                                            className={cnClassNames(
                                                "group relative flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all",
                                                pathname === item.href ? theme.theme.primary : theme.theme.hoverBg,
                                                pathname === item.href ? "text-white" : "",
                                                !isSidebarOpen && "justify-center"
                                            )}
                                        >
                                            <span className="text-lg shrink-0">{item.icon}</span>
                                            {isSidebarOpen ? (
                                                <span className="font-medium truncate">{item.name}</span>
                                            ) : (
                                                    <ToolTip
                                                        title={item.name}
                                                        
                                                    />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </nav>

                        {/* Bottom: shrink-0 keeps this at the very bottom */}
                        <div className="mt-auto p-4 border-t border-white/10 shrink-0">
                            {props.addUserSection && user.user && (
                                <UserSection
                                    name={user.user?.name}
                                    email={user.user?.email}
                                    avatarUrl={user.user?.avatarUrl}
                                    isCollapsed={!isSidebarOpen}
                                    layout="vertical"
                                />
                            )}

                            <div
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                                className={cnClassNames(
                                    "group relative flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all",
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
                                    <span className="font-medium text-sm">Collapse Sidebar</span>
                                ) : (
                                    <ToolTip title="Expand Sidebar" />
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            }
            {/* Mobile Trigger - A floating button to open the menu when closed on mobile */}
            {!isSidebarOpen && (
                <div className="fixed bottom-6 left-6 lg:hidden z-50">
                    <Button
                        className={cnClassNames("p-4 rounded-full shadow-lg", theme.theme.primary)}
                        onClick={() => setSidebarOpen(true)}
                    >
                        {props.icon}
                    </Button>
                </div>
            )}
        </>
    );
}