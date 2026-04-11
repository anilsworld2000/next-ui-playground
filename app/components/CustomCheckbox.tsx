"use client";
import { Check } from "lucide-react";
import cnClassNames, { ICON_SIZES } from "@/app/utils";
import { useTheme } from "../hooks/ThemeContext";

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    label?: string;
    iconSize?: number;
    iconStrokeWidth?: number;
}

export default function CustomCheckbox({ checked, onChange, label, iconSize = ICON_SIZES.sm, iconStrokeWidth = 2 }: CheckboxProps) {
    const { theme } = useTheme();

    // Check if the theme uses hex codes (like Parchment)
    const isHex = theme.primary.startsWith("#");

    return (
        <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={(e) => {
                e.stopPropagation();
                onChange();
            }}
        >
            <div
                style={{
                    backgroundColor: 'transparent', // Always transparent
                    // If checked, use primary color for border; otherwise use theme border
                    borderColor: isHex
                        ? (checked ? theme.primary : theme.border)
                        : undefined,
                }}
                className={cnClassNames(
                    "w-4 h-4 rounded-md border transition-all", "flex items-center justify-center",
                    // Fallback for Tailwind-only themes (Midnight, Emerald)
                    !theme.primary.startsWith('#') && checked ? theme.primary : ""
                )}
            >
                {checked && <Check size={iconSize} strokeWidth={iconStrokeWidth} className={theme.textMain} />}
            </div>
            {label && (
                <span className={cnClassNames("text-sm font-medium", theme.textMain)}>
                    {label}
                </span>
            )}
        </div>
    );
}