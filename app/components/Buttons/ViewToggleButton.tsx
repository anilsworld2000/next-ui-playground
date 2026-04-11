// @/app/components/Buttons/ViewToggleButton.tsx
"use client";
import React from "react";
import { LayoutGrid, List } from "lucide-react";
import cnClassNames, { GENERIC_LABELS, ICON_SIZES } from "@/app/utils";
import Button from "./Button";
import { LayoutConfig } from "@/app/types";

export interface ViewToggleButtonProps {
    view: LayoutConfig;
    onToggle: (view: LayoutConfig) => void;
    disabled?: boolean;
    iconSize?: number;
    iconStrokeWidth?: number;
    cssClasses?: string;
    tooltip?: string;
}

export default function ViewToggleButton({
    view,
    onToggle,
    disabled = false,
    iconSize = ICON_SIZES.lg,
    iconStrokeWidth = 1,
    cssClasses = "",
    tooltip = GENERIC_LABELS.toggle
}: ViewToggleButtonProps) {
    const handleToggle = () => {
        const nextView = view === 'grid' ? 'list' : 'grid';
        onToggle(nextView);
    };

    return (
        <Button
            isCursorPointer
            disabled={disabled}
            className={cnClassNames(
                "flex items-center justify-center transition-all active:scale-95",
                cssClasses,
                disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
            tooltip={tooltip}
            onClick={handleToggle}
        >
            {view === 'grid' ? (
                <LayoutGrid size={iconSize} strokeWidth={iconStrokeWidth} />
            ) : (
                <List size={iconSize} strokeWidth={iconStrokeWidth} />
            )}
        </Button>
    );
}