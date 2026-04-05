import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";

type Props = {
    value: number;      // 0 to 1
    thickness: number;  // height in px
    color: string;      // Tailwind color class, e.g. "bg-blue-500"
};

export default function ProgressLine({ value, thickness, color }: Props) {
    const theme = useTheme();

    return (
        <div
            className={cnClassNames("relative rounded-full overflow-hidden w-full translate-0.5", theme.theme.accent, `h-${thickness}`)}
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
