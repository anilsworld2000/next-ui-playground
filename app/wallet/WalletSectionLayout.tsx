"use client";

import { ReactNode } from "react";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";

export default function WalletSectionLayout({
    children,
    headerControls,
    className,
    mainClassName,
    title,
    subtitle,
}: {
    children: ReactNode;
    headerControls?: React.ReactNode;
    className?: string;
    mainClassName?: string;
    title?: string;
    subtitle?: string;
}) {
    const theme = useTheme();

    return (
        <div className={cnClassNames("flex h-full", className)}>
            <main className={cnClassNames("flex-1 space-y-2 animate-in fade-in duration-500", theme.theme.bg, mainClassName)}>
                <header>
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl  p-1">
                        <div className="min-w-0">
                            <div>
                                {title && <h1 className="text-xl font-bold tracking-tight truncate">{title}</h1>}
                                {subtitle && <p className="opacity-60 text-xs mt-1 truncate">{subtitle}</p>}
                            </div>
                        </div>
                        {headerControls}
                    </div>
                </header>
                {children}
            </main>
        </div >
    );
}
