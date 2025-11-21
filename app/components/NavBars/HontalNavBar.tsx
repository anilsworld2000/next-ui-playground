"use client";
import { NavItem } from "@/app/types";
import Link from "next/link";

interface HorizontalNavBarProps {
    items: NavItem[];
    rightContent?: React.ReactNode; // e.g. selected dashboard name
}

export default function HorizontalNavBar({ items, rightContent }: HorizontalNavBarProps) {
    return (
        <nav className="flex flex-row justify-between items-center bg-white shadow">
            <div className="flex gap-4">
                {items?.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
            {rightContent && <div className="text-slate-800 text-sm">{rightContent}</div>}
        </nav>
    );
}