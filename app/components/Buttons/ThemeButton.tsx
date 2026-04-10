import Button from "./Button";
import { Palette } from "lucide-react";
import { ThemeKey, THEMES, useTheme } from "@/app/hooks/ThemeContext";
import { useState } from "react";
import cnClassNames from "@/app/utils";
import Flyout from "../Flyout/Flyout";
import { ListItem } from "@/app/types";
import ActionList from "../Tables/ActionList";

export default function ThemeButton() {
    const { setTheme, themeKey } = useTheme();
    const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);

    const themeItems: ListItem<string>[] = Object.keys(THEMES).map(key => ({
        id: key,
        label: THEMES[key as keyof typeof THEMES].name,
        value: key,
        indicator: <div className={`w-3 h-3 rounded-full ${THEMES[key as keyof typeof THEMES].primary}`} />
    }));

    return (
        <div className="relative">
            <Button
                className={cnClassNames(`transition-all flex`)}
                onClick={() => setThemeMenuOpen(!isThemeMenuOpen)}
                isCursorPointer
            >
                <Palette size={20} strokeWidth={1} />
            </Button>

            {isThemeMenuOpen && (
                <Flyout
                    title="Theme"
                    showCloseButton
                    isOpen={isThemeMenuOpen}
                    onClose={() => setThemeMenuOpen(false)}
                >
                    <ActionList
                        items={themeItems} selectedValue={themeKey} onSelect={(value) => { setTheme(value as ThemeKey); setThemeMenuOpen(false); }} />
                </Flyout>
            )}
        </div>
    );
}