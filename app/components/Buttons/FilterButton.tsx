"use client";
import React, { useState, useRef, useEffect } from "react";
import { Filter, FunnelPlus } from "lucide-react";
import Button from "./Button";
import cnClassNames, { GENERIC_LABELS, ICON_SIZES } from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";
import Flyout from "../Flyout/Flyout";
import { ListItem, statusColors } from "@/app/types";
import ActionList from "../Tables/ActionList";

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
    iconSize = ICON_SIZES.lg,
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

    const inputTypeFilter = () => {
        return (
            <div className="relative m-2">
                <Filter className="absolute left-2 top-1/2 -translate-y-1/2" size={iconSize} strokeWidth={iconStrokeWidth} />
                <input
                    autoFocus
                    type="text"
                    disabled={disabled}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className={cnClassNames(
                        "w-full pl-8 pr-8 py-2 text-xs rounded border bg-transparent outline-none focus:ring-1 focus:ring-primary/40",
                        theme.border,
                        theme.textMain
                    )}
                />
                {value && (
                    <Button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 text-xs font-bold"
                        disabled={disabled}
                    >
                        ✕
                    </Button>
                )}
            </div>
        )
    };

    const selectTypeFilter = () => {
        if (filterOptions === undefined || filterOptions.length === 0) {
            return <div className={cnClassNames("text-xs opacity-50", theme.textMain)}>{GENERIC_LABELS.noDataFound}</div>;
        }

        const filterList: ListItem<string>[] = filterOptions.map(opt => ({
            id: opt.value,
            label: opt.label,
            value: opt.value
        }));
        return filterList;
    };

    return (
        <div className="relative inline-block" ref={containerRef}>
            <Button
                className={cnClassNames(css, disabled && statusColors["disabled"])}
                tooltip={tooltip || GENERIC_LABELS.filter}
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                isCursorPointer
            >
                {/* Visual indicator that a filter is active */}
                {value ? <FunnelPlus size={iconSize} strokeWidth={iconStrokeWidth} /> : <Filter size={iconSize} strokeWidth={iconStrokeWidth} />}
            </Button>

            {isOpen && (
                <Flyout
                    title={GENERIC_LABELS.filterBy}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    className=""
                    anchorRef={containerRef}
                >
                    <div className="flex items-center justify-between m-2 text-xs">
                        <span className={cnClassNames("font-bold tracking-widest", theme.primaryText)}>{GENERIC_LABELS.filterBy}</span>
                        <Button
                            onClick={handleClear}
                            className={cnClassNames("text-red-500 hover:text-red-700 text-xs transition-colors p-1", disabled && statusColors["disabled"])}
                            disabled={disabled}
                            isCursorPointer
                        >
                            {GENERIC_LABELS.clear}
                        </Button>
                    </div>

                    {/* --- Input Type: Text --- */}
                    {type === "text" && inputTypeFilter()}

                    {/* --- Input Type: Select (Options) --- */}
                    {type === "select" &&
                        <ActionList
                            items={selectTypeFilter() as ListItem<string>[]}
                            selectedValue={value}
                            onSelect={(val) => { onChange(val); setIsOpen(false); }}
                        />
                    }
                </Flyout>
            )}
        </div>
    );
}