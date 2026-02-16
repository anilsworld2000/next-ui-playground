"use client";
import { useTheme } from "@/app/hooks/ThemeContext";
import { NavGroup } from "@/app/types";
import cnClassNames from "@/app/utils";
import router from "next/router";
import { useState } from "react";
import Button from "../Buttons/Button";

interface VerticalNavbarProps {
    title: string;
    icon?: React.ReactNode;
    groups: NavGroup[];
}

export default function VerticalNavbar(props: VerticalNavbarProps) {
    const theme = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)} />
            )}

            {props.groups?.length > 0 &&
                <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${theme.theme.sidebar} rounded-t-xl transition-transform lg:translate-x-0 ${!isSidebarOpen ? 'translate-x-0 w-24' : 'translate-x-full w-56'}`}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                            <Button className={cnClassNames("p-2 rounded-xl", theme.theme.primary)}
                                onClick={() => setSidebarOpen(!isSidebarOpen)}
                            >{props.icon}

                            </Button>
                            {   isSidebarOpen &&
                                <h1 className={cnClassNames("text-xl font-bold tracking-tight cursor-pointer", theme.theme.primaryText)}>{props.title}</h1>
                            }
                        </div>

                        <nav className="flex-1 space-y-1">
                            {props.groups?.map((group) => (
                                <div key={group.id} className="mt-4">
                                    {isSidebarOpen && (
                                        <div className="px-2 py-2 text-xs uppercase tracking-wider">
                                            {group.title}
                                        </div>
                                    )}
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => router.push(item.href)}
                                            className={cnClassNames("flex items-center gap-3 px-4 py-2 cursor-pointer", theme.theme.hoverBg)}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            {isSidebarOpen && <span>{item.name}</span>}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>
            }
        </>
    );
}