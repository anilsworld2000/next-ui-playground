import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";

type Props = {
    value: number;      // 0 to 1
    thickness: number;  // height in px
    width: number
    color: string;      // Tailwind color class, e.g. "bg-blue-500"
};

export default function ProgressLine({ value, thickness, width, color }: Props) {
    const theme = useTheme();

    return (
        <div
            className={cnClassNames("rounded-full overflow-hidden translate-0.5", theme.theme.accent, `h-${thickness}`, `w-${width}`)}
        >
            {/* Filled portion */}
            <div
                className={cnClassNames("h-full", color)}
                style={{
                    width: `${Math.min(value, 100)}%`, // clamp to 100%
                    transition: "width 0.35s ease",
                }}
            />
        </div>
    );
}
