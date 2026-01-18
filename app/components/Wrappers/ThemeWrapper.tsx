// components/Wrappers/ThemeWrapper.tsx
"use client";
import cnClassNames from "@/app/utils";
import { useTheme } from "../../hooks/ThemeContext";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        /* Applying the theme classes here ensures the entire 
           viewport uses the theme background and text color.
        */
        <div className={cnClassNames(theme.bg, theme.textMain, "min-h-screen transition-colors duration-300")}>
            {children}
        </div>
    );
}