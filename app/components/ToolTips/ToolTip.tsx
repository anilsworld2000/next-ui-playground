import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";

interface TootTipProps {
    title: string;
}

export default function ToolTip(props: TootTipProps) {
    const theme = useTheme();
    return (
        <span className={cnClassNames(
            // Position
            "absolute left-full ml-4 px-3 py-1.5 rounded-md text-sm whitespace-nowrap",
            // Animation/Visibility
            "opacity-0 pointer-events-none transition-all duration-200",
            "group-hover:opacity-100 group-hover:translate-x-1",
            // Theme & Style
            theme.theme.primary,
            "text-white shadow-xl z-[100] hidden lg:block"
        )}>
            {/* The Tooltip Arrow */}
            <div className={cnClassNames(
                "absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45",
                theme.theme.primary
            )} />

            <span className="relative z-10 font-medium">{props.title}</span>
        </span>
    )
}