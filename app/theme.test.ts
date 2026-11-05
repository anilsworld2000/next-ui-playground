import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_KEY, isThemeKey, parseThemeKey, THEME_KEYS } from "./config/themes";

describe("theme preference", () => {
    it("accepts every registered theme key", () => {
        for (const themeKey of THEME_KEYS) {
            expect(isThemeKey(themeKey)).toBe(true);
            expect(parseThemeKey(themeKey)).toBe(themeKey);
        }
    });

    it("falls back to the default for missing or invalid values", () => {
        expect(parseThemeKey(undefined)).toBe(DEFAULT_THEME_KEY);
        expect(parseThemeKey("unknown-theme")).toBe(DEFAULT_THEME_KEY);
        expect(isThemeKey("__proto__")).toBe(false);
    });
});
