import Button from "@/app/components/Buttons/Button";
import { ICON_SIZES } from "@/app/utils";

export default function InlineActionButtons(onClick: () => void, tooltip: string, IconComponent: React.FC<{ size: number; strokeWidth: number }>) {
    const iconSize: number = ICON_SIZES.lg;
    const iconThickness: number = 1;

        return (
            <Button
                onClick={onClick}
                className="cursor-pointer rounded-full p-2 text-xs text-main hover:bg-surface-hover hover:text-link-hover"
                tooltip={tooltip}
            >
                <IconComponent size={iconSize} strokeWidth={iconThickness} />
            </Button>
        );
    }