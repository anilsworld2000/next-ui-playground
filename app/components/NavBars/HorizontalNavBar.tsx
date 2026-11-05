"use client";
import type { NavItem } from "@/app/types/navigation";
import cnClassNames from "@/app/utils";
import Link from "next/link";
import UserSection from "../UserSections/UserSection";
import { useUser } from "@/app/hooks/UserContext";

interface HorizontalNavBarProps {
    items: NavItem[];
    rightContent?: React.ReactNode;
    addUserSection: boolean;
}

export default function HorizontalNavBar({ items, rightContent, addUserSection }: HorizontalNavBarProps) {
    const user = useUser();

    return (
        <nav className={cnClassNames("flex flex-row justify-between items-center w-full")}>
            {/* Left Side: Navigation Links */}
            <div className="flex gap-4">
                {items?.map((item) => (
                    <Link
                        title={item.name}
                        key={item.id}
                        href={item.href}
                        className={cnClassNames(
                            "flex items-center gap-1 rounded-xl p-2 text-sm font-medium text-link hover:bg-surface-hover"
                        )}
                    >
                        {item.icon && <span>{item.icon}</span>}
                    </Link>
                ))}
            </div>

            {/* Right Side: Content + User Section */}
            <div className="flex items-center gap-6">
                {rightContent && (
                    <div className="hidden border-r border-border-subtle pr-6 text-sm font-medium text-muted md:block">
                        {rightContent}
                    </div>
                )}

                {addUserSection && user.user && (
                    <UserSection
                        name={user.user.name}
                        email={user.user.email}
                        avatarUrl={user.user.avatarUrl || undefined}
                        layout="horizontal"
                    />
                )}
            </div>
        </nav>
    );
}