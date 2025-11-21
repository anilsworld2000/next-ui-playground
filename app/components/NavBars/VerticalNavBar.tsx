"use client";
import { NavGroup } from "@/app/types";
import router from "next/router";
import { useState } from "react";

interface VerticalNavbarProps {
    groups: NavGroup[];
}

export default function VerticalNavbar(props: VerticalNavbarProps) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <>
            {props.groups?.length > 0 &&
                <div
                    className={`h-screen bg-slate-100 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-56"
                        }`}
                >
                    {/* Toggle button */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-3 text-left hover:bg-slate-400"
                    >
                        {collapsed ? "➡️" : "⬅️ Collapse"}
                    </button>

                    {/* Groups */}
                    <div className="flex-1 overflow-y-auto">
                        {props.groups?.map((group) => (
                            <div key={group.id} className="mt-4">
                                {!collapsed && (
                                    <div className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400">
                                        {group.title}
                                    </div>
                                )}
                                {group.items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => router.push(item.href)}
                                        className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-800"
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {!collapsed && <span>{item.name}</span>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    );
}