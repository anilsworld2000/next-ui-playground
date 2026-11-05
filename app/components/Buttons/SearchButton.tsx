"use client";
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import cnClassNames, { GENERIC_LABELS, ICON_SIZES } from "@/app/utils";
import Button from "./Button";
import { statusColors } from "@/app/types/ui";

export interface SearchInputProps {
    value: string;
    onSearch: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    iconSize?: number;
    iconStrokeWidth?: number;
    className?: string;
    containerClassName?: string;
}

export default function SearchButton({
    value,
    onSearch,
    disabled = false,
    placeholder = GENERIC_LABELS.search,
    iconSize = ICON_SIZES.lg,
    iconStrokeWidth = 1,
    className = "",
    containerClassName = ""
}: SearchInputProps) {
    // Local state to keep typing snappy, even if parent logic is heavy
    const [localValue, setLocalValue] = useState(value);

    // Sync local state if parent value changes (e.g., from a "Clear All" global button)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (val: string) => {
        setLocalValue(val);
        onSearch(val);
    };

    const handleClear = () => {
        setLocalValue("");
        onSearch("");
    };


    return (
        <div className={cnClassNames(
            "relative min-w-[220px] sm:min-w-[260px] transition-opacity",
            disabled ? statusColors["disabled"] : "",
            containerClassName
        )}>
            {/* Search Icon */}
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                size={iconSize-2}
                strokeWidth={iconStrokeWidth}
            />

            <input
                type="text"
                value={localValue}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={`${placeholder}...`}
                className={cnClassNames(
                    "w-full rounded-xl border px-10 text-sm outline-none transition-all",
                    "bg-canvas border-border-subtle text-main",
                    disabled ? statusColors["disabled"] : "focus:ring-1 focus:ring-primary/30",
                    className
                )}
            />

            {/* Clear Button - Only shows when there is text */}
            {localValue && !disabled && (
                <Button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 text-danger transition-colors hover:opacity-100"
                >
                    <X size={iconSize - 2} strokeWidth={iconStrokeWidth + 1} />
                </Button>
            )}
        </div>
    );
}