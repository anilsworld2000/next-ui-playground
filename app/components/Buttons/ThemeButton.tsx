import Button from "./Button";
import { Palette } from "lucide-react";
import { useTheme } from "@/app/hooks/ThemeContext";
import { THEMES, THEME_KEYS, type ThemeKey } from "@/app/config/themes";
import { useRef, useState } from "react";
import cnClassNames, { ICON_SIZES } from "@/app/utils";
import Flyout from "../Flyout/Flyout";
import type { ListItem } from "@/app/types/ui";
import ActionList from "../Tables/ActionList";

export default function ThemeButton() {
    const { setTheme, themeKey } = useTheme();
    const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const themeItems: ListItem<ThemeKey>[] = THEME_KEYS.map(key => ({
        id: key,
        label: THEMES[key].name,
        value: key,
        indicator: <span data-theme={key} aria-hidden="true" className="size-3 rounded-full bg-primary" />
    }));

    return (
        <div className="relative" ref={containerRef}>
            <Button
                className={cnClassNames(`transition-all flex`)}
                onClick={() => setThemeMenuOpen(!isThemeMenuOpen)}
                isCursorPointer
            >
                <Palette size={ICON_SIZES.md} strokeWidth={1} />
            </Button>

            {isThemeMenuOpen && (
                <Flyout
                    title="Theme"
                    showCloseButton
                    isOpen={isThemeMenuOpen}
                    onClose={() => setThemeMenuOpen(false)}
                    anchorRef={containerRef}
                >
                    <ActionList
                        items={themeItems} selectedValue={themeKey} onSelect={(value) => { setTheme(value); setThemeMenuOpen(false); }} />
                </Flyout>
            )}
        </div>
    );
}