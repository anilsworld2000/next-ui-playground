"use client";
import { useTheme } from "@/app/hooks/ThemeContext";
import { NavItem } from "@/app/types";
import cnClassNames from "@/app/utils";
import Link from "next/link";
import UserSection from "../UserSections/UserSection";

interface HorizontalNavBarProps {
    items: NavItem[];
    rightContent?: React.ReactNode;
    addUserSection: boolean;
}

export default function HorizontalNavBar({ items, rightContent, addUserSection }: HorizontalNavBarProps) {
    const theme = useTheme();

    return (
        <nav className={cnClassNames("flex flex-row justify-between items-center w-full")}>
            {/* Left Side: Navigation Links */}
            <div className="flex gap-4">
                {items?.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={cnClassNames(
                            theme.theme.primaryText,
                            theme.theme.hoverBg,
                            'p-2 rounded-xl text-sm font-medium items-center gap-1 flex'
                        )}
                    >
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>

            {/* Right Side: Content + User Section */}
            <div className="flex items-center gap-6">
                {rightContent && (
                    <div className="text-slate-500 text-sm font-medium border-r pr-6 hidden md:block">
                        {rightContent}
                    </div>
                )}

                {addUserSection && (
                    <UserSection
                        name="John Doe"
                        email="john@doe.com"
                        layout="horizontal"
                    />
                )}
            </div>
        </nav>
    );
}