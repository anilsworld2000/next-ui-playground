"use client";
import { Check } from "lucide-react";
import cnClassNames, { ICON_SIZES } from "@/app/utils";

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    label?: string;
    iconSize?: number;
    iconStrokeWidth?: number;
}

export default function CustomCheckbox({ checked, onChange, label, iconSize = ICON_SIZES.sm, iconStrokeWidth = 2 }: CheckboxProps) {
    return (
        <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={(e) => {
                e.stopPropagation();
                onChange();
            }}
        >
            <div
                className={cnClassNames(
                    "w-4 h-4 rounded-md border transition-all flex items-center justify-center",
                    checked ? "bg-primary border-primary text-primary-foreground" : "border-border-subtle",
                )}
            >
                {checked && <Check size={iconSize} strokeWidth={iconStrokeWidth} />}
            </div>
            {label && (
                <span className="text-sm font-medium text-main">
                    {label}
                </span>
            )}
        </div>
    );
}