"use client";
import { useTheme } from "@/app/hooks/ThemeContext";
import { NavItem } from "@/app/types";
import cnClassNames from "@/app/utils";
import Link from "next/link";

interface HorizontalNavBarProps {
    items: NavItem[];
    rightContent?: React.ReactNode; // e.g. selected dashboard name
}

export default function HorizontalNavBar({ items, rightContent }: HorizontalNavBarProps) {
    const theme = useTheme();
    return (
        <nav className={cnClassNames(`flex flex-row justify-between items-center`)}>
            <div className="flex gap-4">
                {items?.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={cnClassNames(theme.theme.primaryText, theme.theme.hoverBg, 'p-2 rounded-xl text-sm font-medium items-center gap-1 flex')}
                    >
                        {item.icon ? item.icon : item.name}
                    </Link>
                ))}
            </div>
            {rightContent && <div className="text-slate-800 text-sm">{rightContent}</div>}
        </nav>
    );
}