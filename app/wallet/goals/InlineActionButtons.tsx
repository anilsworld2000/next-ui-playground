import Button from "@/app/components/Buttons/Button";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames, { ICON_SIZES } from "@/app/utils";

export default function InlineActionButtons(onClick: () => void, tooltip: string, IconComponent: React.FC<{ size: number; strokeWidth: number }>) {
    const theme = useTheme();
    const iconSize: number = ICON_SIZES.lg;
    const iconThickness: number = 1;

        return (
            <Button
                onClick={onClick}
                className={cnClassNames("text-xs p-2 cursor-pointer rounded-full", theme.theme.hoverBg, theme.theme.textMain, theme.theme.hoverText)}
                tooltip={tooltip}
            >
                <IconComponent size={iconSize} strokeWidth={iconThickness} />
            </Button>
        );
    }