import { useTheme } from "@/app/hooks/ThemeContext";

type Props = {
    value: number; // 0 to 1
    size: number; // outer diameter in px
    thickness: number; // stroke thickness
    color: string; // Tailwind color class, e.g. "text-blue-500"
};

export default function ProgressRing({ value, size, thickness, color }: Props) {
    const radius = (size - thickness) / 2; // radius adjusted for stroke
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - value * circumference;
    const theme = useTheme();

    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Background circle */}
            <circle
                stroke="currentColor"
                className={theme.theme.textMuted}
                fill="transparent"
                strokeWidth={thickness}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Progress circle */}
            <circle
                stroke="currentColor"
                className={color} // e.g. "text-blue-500"
                fill="transparent"
                strokeWidth={thickness}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: "stroke-dashoffset 0.35s ease" }}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className={`${theme.theme.textMain} font-medium progress-text`}
            >
                {`${Math.round(value * 100)}%`}
            </text>

        </svg>
    );
}
  