"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
        border: 'border-slate-200',
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
        border: 'border-black',
        primary: 'bg-black',
        primaryText: 'text-black',
        hoverBg: 'hover:bg-zinc-200',
        hoverText: 'hover:text-zinc-600',
        accent: 'bg-zinc-100',
        button: 'bg-black hover:bg-zinc-800 text-white',
        textMuted: 'text-zinc-500',
        textMain: 'text-black'
    },
    parchment: {
        name: "Parchment",
        bg: "#F4ECD8",          // Warm, paper-like cream
        sidebar: "#E9DFCE",     // Slightly darker than bg to define space
        card: "#FCF6E9",        // Lighter "page" surface
        border: "#D3C6AA",      // Soft earthy border
        primary: "#859900",     // Muted olive green (Natural accent)
        primaryText: "#5C4F33", // Deep brown (Avoids pure black)
        hoverBg: "#E3D4B6",
        hoverText: "#433A26",
        accent: "#E2D8B9",
        button: "#859900",      // Matching muted green
        textMuted: "#8B7D6B",   // Soft clay grey
        textMain: "#433A26",    // Dark coffee bean (Softer than black)
    },
} as const;

type ThemeKey = keyof typeof THEMES;

// 2. Define Context Props
interface ThemeContextType {
    theme: ThemeColors;
    themeKey: ThemeKey;
    setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeKey, setThemeKey] = useState<ThemeKey>('monochrome');

    // Optional: Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme') as ThemeKey;
        if (savedTheme && THEMES[savedTheme]) {
            setThemeKey(savedTheme);
        }
    }, []);

    const handleSetTheme = (key: ThemeKey) => {
        setThemeKey(key);
        localStorage.setItem('app-theme', key);
    };

    return (
        <ThemeContext.Provider value={{
            theme: THEMES[themeKey],
            themeKey,
            setTheme: handleSetTheme
        }}>
            {children}
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