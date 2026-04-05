"use client";
import React, { useState, useRef, useEffect } from "react";
import { Filter, FunnelPlus } from "lucide-react";
import Button from "./Button";
import cnClassNames, { GENERIC_LABELS } from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";

type FilterOption = { value: string; label: string };

export type FilterButtonProps = {
    cssClasses?: string;
    tooltip?: string;
    iconSize?: number;
    iconStrokeWidth?: number;
    value: string;
    onChange: (value: string) => void;
    filterOptions?: FilterOption[];
    placeholder?: string;
    type?: "text" | "select";
    disabled?: boolean;
};

export default function FilterButton({
    onChange,
    value,
    filterOptions,
    cssClasses,
    tooltip,
    iconSize = 16,
    iconStrokeWidth = 2,
    placeholder = `${GENERIC_LABELS.filter}...`,
    type = "text",
    disabled = false
}: FilterButtonProps) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClear = () => {
        onChange("");
    };

    const css = cssClasses ||
        cnClassNames("inline-flex items-center justify-center rounded p-1 transition-all")

    return (
        <div className="relative inline-block" ref={containerRef}>
            <Button
                className={css}
                tooltip={tooltip || GENERIC_LABELS.filter}
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
            >
                {/* Visual indicator that a filter is active */}
                {value ? <FunnelPlus size={iconSize} strokeWidth={iconStrokeWidth} /> : <Filter size={iconSize} strokeWidth={iconStrokeWidth} />}
            </Button>

            {isOpen && (
                <div
                    className={cnClassNames(
                        "absolute right-0 mt-2 w-64 rounded-lg border shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100",
                        theme.bg, theme.border
                    )}
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Filter By</span>
                        {value && (
                            <Button
                                onClick={handleClear}
                                className="text-[10px] text-red-500 font-bold hover:underline"
                                disabled={disabled}
                            >
                                {GENERIC_LABELS.clear}
                            </Button>
                        )}
                    </div>

                    {/* --- Input Type: Text --- */}
                    {type === "text" && (
                        <div className="relative">
                            <input
                                autoFocus
                                type="text"
                                disabled={disabled}
                                value={value}
                                placeholder={placeholder}
                                onChange={(e) => onChange(e.target.value)}
                                style={{
                                    borderColor: theme.border.startsWith('#') ? theme.border : undefined,
                                    color: theme.textMain.startsWith('#') ? theme.textMain : undefined
                                }}
                                className={cnClassNames(
                                    "w-full pl-8 pr-3 py-2 text-xs rounded border bg-transparent outline-none focus:ring-1 focus:ring-primary/40",
                                    theme.border
                                )}
                            />
                            <Filter size={iconSize}
                                strokeWidth={iconStrokeWidth} />
                        </div>
                    )}

                    {/* --- Input Type: Select (Options) --- */}
                    {type === "select" && filterOptions && (
                        <div className="space-y-1 max-h-48 overflow-auto custom-scrollbar">
                            {filterOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={cnClassNames(
                                        "px-2 py-1.5 rounded cursor-pointer text-xs transition-colors",
                                        value === opt.value ? theme.hoverBg + " font-bold" : "hover:opacity-70"
                                    )}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}