"use client";

import { ReactNode, useState } from "react";
import { useTheme } from "@/app/hooks/ThemeContext";
import { Plus, Search, Filter, Printer } from "lucide-react";
import Button from "@/app/components/Buttons/Button";
import cnClassNames from "@/app/utils";

type FilterOption = { value: string; label: string };

export default function WalletSectionLayout({
    children,
    className,
    mainClassName,
    header,
    title,
    subtitle,
    onSearch,
    onFilter,
    filterOptions,
    onAdd,
    onPrint,
}: {
    children: ReactNode;
    className?: string;
    mainClassName?: string;
    header?: ReactNode;
    title?: string;
    subtitle?: string;
    onSearch?: (value: string) => void;
    onFilter?: (value: string) => void;
    filterOptions?: FilterOption[];
    onAdd?: () => void;
    onPrint?: () => void;
}) {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const headerIconSize: number = 18;

    const filterItemOptions = filterOptions ?? [
        { value: "", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
    ];

    const showControls = Boolean(onSearch || onFilter || onAdd || onPrint || filterItemOptions.length > 0);
    const hasHeader = Boolean(header || title || subtitle || showControls);

    const actionButtonClass = cnClassNames(
        "flex items-center gap-1 h-10 px-3 rounded-full font-semibold transition-all active:scale-95",
         theme.theme.hoverBg
    );

    return (
        <div className={cnClassNames("flex h-full", className)}>
            <main className={cnClassNames("flex-1 space-y-8 animate-in fade-in duration-500", theme.theme.bg, mainClassName)}>
                {hasHeader && (
                    <header>
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg p-1 ">
                            <div className="min-w-0">
                                {header ?? (
                                    <div>
                                        {title && <h1 className="text-3xl font-bold tracking-tight truncate">{title}</h1>}
                                        {subtitle && <p className="opacity-60 text-sm mt-1 truncate">{subtitle}</p>}
                                    </div>
                                )}
                            </div>

                            {showControls && (
                                <div className="flex items-center gap-2 flex-nowrap overflow-x-auto justify-end">
                                    <div className="relative min-w-[220px] sm:min-w-[260px]">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSearchTerm(value);
                                                if (onSearch) onSearch(value);
                                            }}
                                            placeholder="Search..."
                                            className={cnClassNames("h-8 w-full rounded-xl border px-10 text-sm outline-none transition", theme.theme.bg, theme.theme.border, theme.theme.hoverBg)}
                                        />
                                    </div>

                                    <Button className={actionButtonClass} tooltip="Filter" onClick={() => { if (onFilter) onFilter(filterValue); }}>
                                        <Filter size={headerIconSize} />
                                    </Button>

                                    <Button className={actionButtonClass} tooltip="Add" onClick={() => { if (onAdd) onAdd(); }}>
                                        <Plus size={headerIconSize} />
                                    </Button>

                                    <Button className={actionButtonClass} tooltip="Print" onClick={() => {
                                        if (onPrint) onPrint();
                                        else if (typeof window !== "undefined") window.print();
                                    }}>
                                        <Printer size={headerIconSize} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {children}
            </main>
        </div>
    );
}
