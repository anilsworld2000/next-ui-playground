"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
    DEFAULT_THEME_KEY,
    isThemeKey,
    THEME_COOKIE_NAME,
    type ThemeKey,
} from "@/app/config/themes";

interface ThemeContextType {
    themeKey: ThemeKey;
    setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
    children,
    initialTheme = DEFAULT_THEME_KEY,
}: {
    children: ReactNode;
    initialTheme?: ThemeKey;
}) {
    const [themeKey, setThemeKey] = useState(initialTheme);
    const handleSetTheme = (key: ThemeKey) => {
        if (!isThemeKey(key)) {
            return;
        }

        setThemeKey(key);
        document.documentElement.dataset.theme = key;

        const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `${THEME_COOKIE_NAME}=${key}; Path=/; Max-Age=31536000; SameSite=Lax${secureAttribute}`;
    };

    return (
        <ThemeContext.Provider value={{ themeKey, setTheme: handleSetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}