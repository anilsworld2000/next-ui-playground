"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import cnClassNames from '../utils';

// 1. Define the shape of a single theme based on your object
export type ThemeColors = {
    name: string;
    bg: string;
    sidebar: string;
    card: string;
    border: string;
    primary: string;
    primaryText: string;
    hoverBg: string;        // Background hover
    hoverText: string;      // Text hover
    accent: string;         // Accent background
    button: string;         // Button styles
    textMuted: string;
    textMain: string;
};

export const THEMES = {
    midnight: {
        name: 'Midnight',
        bg: 'bg-slate-950',
        sidebar: 'bg-slate-900',
        card: 'bg-slate-900',
        border: 'border-slate-800',
        primary: 'bg-indigo-600',
        primaryText: 'text-indigo-400',
        hoverBg: 'hover:bg-indigo-600',      // Background hover
        hoverText: 'hover:text-indigo-300',  // Text hover
        accent: 'bg-indigo-500/10',
        button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        textMuted: 'text-slate-400',
        textMain: 'text-slate-100'
    },
    emerald: {
        name: 'Emerald Forest',
        bg: 'bg-stone-950',
        sidebar: 'bg-stone-900',
        card: 'bg-stone-900',
        border: 'border-stone-800',
        primary: 'bg-emerald-600',
        primaryText: 'text-emerald-400',
        hoverBg: 'hover:bg-emerald-600',      // Background hover
        hoverText: 'hover:text-emerald-300',  // Text hover
        accent: 'bg-emerald-500/10',
        button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        textMuted: 'text-stone-400',
        textMain: 'text-stone-100'
    },
    amethyst: {
        name: 'Royal Amethyst',
        bg: 'bg-zinc-950',
        sidebar: 'bg-zinc-900',
        card: 'bg-zinc-900',
        border: 'border-zinc-800',
        primary: 'bg-purple-600',
        primaryText: 'text-purple-400',
        hoverBg: 'hover:bg-purple-600',      // Background hover
        hoverText: 'hover:text-purple-300',  // Text hover
        accent: 'bg-purple-500/10',
        button: 'bg-purple-600 hover:bg-purple-500 text-white',
        textMuted: 'text-zinc-400',
        textMain: 'text-zinc-100'
    },
    light: {
        name: 'Cloud Soft',
        bg: 'bg-slate-50',
        sidebar: 'bg-white',
        card: 'bg-white',
        border: 'border-blue-200',
        primary: 'bg-blue-600',
        primaryText: 'text-blue-600',
        hoverBg: 'hover:bg-blue-100',       // Subtle background hover for light mode
        hoverText: 'hover:text-blue-700',    // Darker text hover for readability
        accent: 'bg-blue-50',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        textMuted: 'text-slate-500',
        textMain: 'text-slate-900'
    },
    monochrome: {
        name: 'Black & White',
        bg: 'bg-white',
        sidebar: 'bg-zinc-50',
        card: 'bg-white',
        border: 'border-slate-300',
        primary: 'bg-black',
        primaryText: 'text-black',
        hoverBg: 'hover:bg-zinc-200',
        hoverText: 'hover:text-zinc-600',
        accent: 'bg-zinc-300',
        button: 'bg-black hover:bg-zinc-800 text-white',
        textMuted: 'text-zinc-500',
        textMain: 'text-black'
    },
} as const;

export type ThemeKey = keyof typeof THEMES;

// 2. Define Context Props
interface ThemeContextType {
    theme: ThemeColors;
    themeKey: ThemeKey;
    setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeKey, setThemeKey] = useState<ThemeKey>('light');
    const activeTheme = THEMES[themeKey];

    // This bridge converts your theme object into CSS variables
    const dynamicStyles = {
        '--color-primary': activeTheme.primary.startsWith('#') ? activeTheme.primary : '',
        '--color-border': activeTheme.border.startsWith('#') ? activeTheme.border : '',
        '--color-text-main': activeTheme.textMain.startsWith('#') ? activeTheme.textMain : '',
        '--color-bg': activeTheme.bg.startsWith('#') ? activeTheme.bg : '',
    } as React.CSSProperties;

    const handleSetTheme = (key: ThemeKey) => {
        setThemeKey(key);
        localStorage.setItem('app-theme', key);
    };

    useEffect(() => {
        const storedTheme = localStorage.getItem('app-theme') as ThemeKey;
        // Check if the stored theme actually exists in our THEMES object
        if (storedTheme && THEMES[storedTheme]) {
            setThemeKey(storedTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{
            theme: activeTheme,
            themeKey,
            setTheme: handleSetTheme
        }}>
            {/* The Wrapper now injects the variables into the DOM tree */}
            <div
                style={dynamicStyles}
                className={cnClassNames(
                    "min-h-screen transition-all duration-500",
                    // Use Tailwind class if it's not a hex code
                    !activeTheme.bg.startsWith('#') ? activeTheme.bg : ""
                )}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

// 4. Custom Hook
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}