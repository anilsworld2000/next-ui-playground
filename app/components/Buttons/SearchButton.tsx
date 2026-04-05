"use client";
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames, { GENERIC_LABELS } from "@/app/utils";
import Button from "./Button";
import { statusColors } from "@/app/types";

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
    iconSize = 18,
    iconStrokeWidth = 1,
    className = "",
    containerClassName = ""
}: SearchInputProps) {
    const { theme } = useTheme();
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
                    theme.bg, theme.border,
                    disabled ? statusColors["disabled"] : "focus:ring-1 focus:ring-primary/30",
                    className
                )}
            />

            {/* Clear Button - Only shows when there is text */}
            {localValue && !disabled && (
                <Button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 hover:text-red-500 transition-colors"
                >
                    <X size={iconSize - 2} strokeWidth={iconStrokeWidth + 1} />
                </Button>
            )}
        </div>
    );
}