import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";

type params = {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: string;
    placeholder?: string;
    error?: string;
    suffix?: string;
    min?: number;
    max?: number;
};

export default function FormInput({
    label,
    value,
    onChange,
    type,
    placeholder,
    error,
    suffix,
    min,
    max
}: params) {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-2 mb-4">
            <label className={cnClassNames("text-sm font-semibold", theme.textMain)}>
                {label}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    className={cnClassNames(
                        "flex-1 px-3 py-2 rounded-lg border transition-colors text-sm focus:border-2 focus:outline-none",
                        theme.bg,
                        theme.textMain,
                        error ? "border-red-500 bg-red-50/10" : theme.border,
                    )}
                />
                {suffix && <span className={cnClassNames("text-sm font-medium", theme.textMuted)}>{suffix}</span>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}