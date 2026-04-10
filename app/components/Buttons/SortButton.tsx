"use client";
import React from "react";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames, { GENERIC_LABELS } from "@/app/utils";
import { SortConfig } from "@/app/types";
import Button from "./Button";

export interface SortButtonProps {
    title?: string;
    sortKey: string;             // The key for this specific column
    currentSort: SortConfig;        // The current global sort state
    onSortChange: (config: SortConfig) => void; // The "Smart" callback
    iconSize?: number;
    iconStrokeWidth?: number;
    cssClasses?: string;
    disabled?: boolean;
}

export default function SortButton({
    sortKey,
    currentSort,
    onSortChange,
    iconSize = 14,
    iconStrokeWidth = 1,
    cssClasses,
    disabled = false,
    title = "",
}: SortButtonProps) {
    const { theme } = useTheme();

    // 1. Logic Check: Is this button the one currently active?
    const isActive = currentSort?.key === sortKey;
    title = title || sortKey; // Fallback to sortKey if title is not provided
    const direction = isActive ? currentSort?.dir : null;

    // 2. The Internal Logic: Determine the next state
    const handleSortToggle = (e?: React.MouseEvent) => {
        // Prevent click bubbling if needed (e.g., inside a Table Header)
        e?.stopPropagation();

        let nextConfig: SortConfig = null;

        if (!isActive) {
            // Cycle 1: Not active -> Ascending
            nextConfig = { key: sortKey, dir: 'asc' };
        } else if (direction === 'asc') {
            // Cycle 2: Ascending -> Descending
            nextConfig = { key: sortKey, dir: 'desc' };
        } else {
            // Cycle 3: Descending -> Null (Reset)
            nextConfig = null;
        }

        onSortChange(nextConfig);
    };

    const getIcon = () => {
        if (direction === 'asc') return <ChevronUp size={iconSize} strokeWidth={iconStrokeWidth} />;
        if (direction === 'desc') return <ChevronDown size={iconSize} strokeWidth={iconStrokeWidth} />;
        return <ArrowUpDown size={iconSize} strokeWidth={iconStrokeWidth} className="opacity-100" />;
    };

    const getSortDirectionLabel = () => {
        if (direction === 'asc') return GENERIC_LABELS.asc;
        if (direction === 'desc') return GENERIC_LABELS.desc;
        return "";
    }

    return (
        <Button
            isCursorPointer
            disabled={disabled}
            onClick={handleSortToggle}
            className={cssClasses || cnClassNames(
                "inline-flex items-center justify-center rounded p-1 transition-all",
                isActive ? theme.textMain : "opacity-100 hover:opacity-100", theme.hoverBg
            )}
            tooltip={isActive ? `Sorted ${getSortDirectionLabel()}` : `Sort by ${title}`}
        >
            {getIcon()}
        </Button>
    );
}