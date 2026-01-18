import Button from "./Button";
import { Check, Palette } from "lucide-react";
import { THEMES, useTheme } from "@/app/hooks/ThemeContext";
import { useState } from "react";
import cnClassNames from "@/app/utils";

export default function ThemeButton() {
    const { theme, setTheme, themeKey } = useTheme();
    const [isThemeMenuOpen, setThemeMenuOpen] = useState(false);

    return (
        <div className="relative">
            <Button className={cnClassNames(`transition-all flex`)}
                onClick={() => setThemeMenuOpen(!isThemeMenuOpen)}>
                <Palette size={20} />
                <span className="hidden sm:inline">{theme.name}</span>
            </Button>

            {isThemeMenuOpen && (
                <div className={`absolute right-0 mt-3 w-48 ${theme.card} border ${theme.border} rounded-2xl shadow-2xl z-50 p-2`}>
                    {Object.keys(THEMES).map((key) => (
                        <button
                            key={key}
                            onClick={() => { setTheme(key as keyof typeof THEMES); setThemeMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm ${themeKey === key ? theme.accent + ' ' + theme.primaryText : 'hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${THEMES[key as keyof typeof THEMES].primary}`}></div>
                                {THEMES[key as keyof typeof THEMES].name}
                            </div>
                            {themeKey === key && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}