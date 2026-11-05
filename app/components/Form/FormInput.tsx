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
    return (
        <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-main">
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
                        "bg-canvas text-main",
                        error ? "border-danger bg-danger-surface/10" : "border-border-subtle",
                    )}
                />
                {suffix && <span className="text-sm font-medium text-muted">{suffix}</span>}
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    )
}