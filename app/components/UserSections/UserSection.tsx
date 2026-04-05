"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";
import ToolTip from "../ToolTips/ToolTip";
import Image from "next/image";
import { useUser } from "@/app/hooks/UserContext";

interface UserSectionProps {
    name: string;
    email?: string;
    avatarUrl?: string;
    isCollapsed?: boolean;
    layout?: "vertical" | "horizontal";
    onSignOut?: () => void; // Pass sign-out logic here
}

export default function UserSection({ name, email, isCollapsed, layout, onSignOut }: UserSectionProps) {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cnClassNames(
                    "group flex items-center p-2 rounded-xl transition-all cursor-pointer",
                    theme.theme.hoverBg,
                    isCollapsed ? "justify-center" : "gap-3",
                )}
            >
                {/* Avatar */}
                <div className={cnClassNames(
                    "flex items-center justify-center shrink-0 rounded-full font-bold text-white w-10 h-10 shadow-sm",
                    theme.theme.primary
                )}>
                    {user?.avatarUrl ? <Image
                        src={user.avatarUrl}
                        title={user.name}
                        className="rounded-full"
                        alt={name.charAt(0).toUpperCase()}
                    /> : name.charAt(0).toUpperCase()}
                </div>

                {/* Name - only if not collapsed or is horizontal */}
                {(!isCollapsed || layout === "horizontal") && (
                    <div className="flex flex-col truncate max-w-[120px]">
                        <span className={cnClassNames("text-sm font-semibold truncate", theme.theme.primaryText)}>{user?.name}</span>
                        {email && <span className="text-xs opacity-60 truncate">{email}</span>}
                    </div>
                )}

                {isCollapsed && layout === "vertical" && <ToolTip title={user?.name || ""} />}
            </div>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div className={cnClassNames(
                    "absolute z-[100] w-48 border rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100",
                    theme.theme.bg,
                    // Position logic: Top for Vertical, Bottom for Horizontal
                    layout === "vertical" ? "bottom-full left-0 mb-2" : "top-full right-0 mt-2"
                )}>
                    <div className="px-3 py-2 border-b mb-1">
                        <p className={cnClassNames(theme.theme.primaryText, "text-xs uppercase font-bold")}>Account</p>
                    </div>
                    <button
                        className={cnClassNames("w-full text-left px-3 py-2 text-sm rounded-lg",
                            theme.theme.hoverBg,
                            theme.theme.primaryText
                        )}
                    >
                        Profile Settings
                    </button>
                    <button
                        onClick={onSignOut}
                        className={cnClassNames("w-full text-left px-3 py-2 text-sm rounded-lg",
                            theme.theme.hoverBg,
                            theme.theme.primaryText,
                        )}
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}