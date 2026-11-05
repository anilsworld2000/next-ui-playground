export const THEME_KEYS = ["midnight", "emerald", "amethyst", "light", "monochrome"] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export const DEFAULT_THEME_KEY: ThemeKey = "light";
export const THEME_COOKIE_NAME = "app-theme";

export const THEMES: Record<ThemeKey, { name: string }> = {
    midnight: { name: "Midnight" },
    emerald: { name: "Emerald Forest" },
    amethyst: { name: "Royal Amethyst" },
    light: { name: "Cloud Soft" },
    monochrome: { name: "Black & White" },
};

export function isThemeKey(value: unknown): value is ThemeKey {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(THEMES, value);
}

export function parseThemeKey(value: string | undefined): ThemeKey {
    return isThemeKey(value) ? value : DEFAULT_THEME_KEY;
}
