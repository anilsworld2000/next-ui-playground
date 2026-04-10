import Button from "./Button";
import { Check, Palette } from "lucide-react";
import { THEMES, useTheme } from "@/app/hooks/ThemeContext";
import { useState } from "react";
import cnClassNames from "@/app/utils";
import Flyout from "../Flyout/Flyout";

export default function ThemeButton() {
    const { theme, setTheme, themeKey } = useTheme();
    const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);

    const createThemeOptions = () => {
        return (Object.keys(THEMES).map((key) => (
            <Button
                isCursorPointer
                tooltip={THEMES[key as keyof typeof THEMES].name}
                key={key}
                onClick={() => { setTheme(key as keyof typeof THEMES); setThemeMenuOpen(false); }}
                className={cnClassNames("w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm",
                    themeKey === key && theme.accent, theme.primaryText,
                        theme.hoverBg
                )}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${THEMES[key as keyof typeof THEMES].primary}`}></div>
                    {THEMES[key as keyof typeof THEMES].name}
                </div>
                {themeKey === key && <Check size={14} />}
            </Button>
        )));
    };

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
                    {createThemeOptions()}
                </Flyout>
            )}
        </div>
    );
}