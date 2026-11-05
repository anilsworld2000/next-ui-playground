"use client";

import { useState, useRef, useEffect } from "react";
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
    onSignOut?: () => void;
}

export default function UserSection({
    name,
    email,
    avatarUrl,
    isCollapsed,
    layout,
    onSignOut,
}: UserSectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();

    const displayName = user?.name ?? name ?? "User";
    const resolvedAvatarUrl = user?.avatarUrl ?? avatarUrl;
    const initials = displayName.trim().charAt(0).toUpperCase() || "U";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuAction = (callback?: () => void) => {
        callback?.();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <div
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => setIsOpen((open) => !open)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsOpen((open) => !open);
                    }
                }}
                className={cnClassNames(
                    "group flex items-center p-2 rounded-xl transition-all cursor-pointer",
                    "hover:bg-surface-hover",
                    isCollapsed ? "justify-center" : "gap-3",
                )}
            >
                <div
                    className={cnClassNames(
                        "flex items-center justify-center shrink-0 rounded-full font-bold text-primary-foreground w-10 h-10 shadow-sm overflow-hidden",
                        "bg-primary"
                    )}
                >
                    {resolvedAvatarUrl ? (
                        <Image
                            src={resolvedAvatarUrl}
                            width={40}
                            height={40}
                            unoptimized
                            className="rounded-full object-cover"
                            alt={`${displayName} avatar`}
                        />
                    ) : (
                        initials
                    )}
                </div>

                {(!isCollapsed || layout === "horizontal") && (
                    <div className="flex flex-col truncate max-w-[120px]">
                        <span className="truncate text-sm font-semibold text-link">{displayName}</span>
                        {email && <span className="text-xs opacity-60 truncate">{email}</span>}
                    </div>
                )}

                {isCollapsed && layout === "vertical" && <ToolTip title={displayName} />}
            </div>

            {isOpen && (
                <div
                    role="menu"
                    className={cnClassNames(
                        "absolute z-[100] w-48 border rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100",
                        "border-border-subtle bg-surface text-main",
                        layout === "vertical" ? "bottom-full left-0 mb-2" : "top-full right-0 mt-2"
                    )}
                >
                    <div className="px-3 py-2 border-b mb-1">
                        <p className="text-xs font-bold uppercase text-link">Account</p>
                    </div>

                    <button
                        type="button"
                        className={cnClassNames(
                            "w-full text-left px-3 py-2 text-sm rounded-lg",
                            "hover:bg-surface-hover text-main"
                        )}
                        onClick={() => handleMenuAction()}
                    >
                        Profile Settings
                    </button>

                    <button
                        type="button"
                        onClick={() => handleMenuAction(onSignOut)}
                        className={cnClassNames(
                            "w-full text-left px-3 py-2 text-sm rounded-lg",
                            "hover:bg-surface-hover text-main",
                        )}
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}