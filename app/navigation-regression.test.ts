import { describe, expect, it } from "vitest";
import {
    assertRouteAccess,
    canAccessRoute,
    hasRole,
    isRouteAllowed,
    parseSessionUser,
    resolveRouteAccessRule,
} from "./auth/session";
import { dashboardRegistry, getDashboardTitle } from "./config/dashboardRegistry";
import { getSidebarClasses } from "./components/NavBars/VerticalNavBar";
import { devotionalNavigation } from "./devotional/navigation";
import { readingNavigation } from "./reading/navigation";
import { walletNavigation } from "./wallet/navigation";

describe("route metadata regression tests", () => {
    it("resolves a dashboard title from the current pathname", () => {
        expect(getDashboardTitle("/devotional/ram")).toBe("Devotional");
        expect(getDashboardTitle("/wallet/asset-allocation")).toBe("Wallet");
        expect(getDashboardTitle("/unknown/route")).toBe("");
    });

    it("keeps the home dashboard registry discoverable and consistent", () => {
        const paths = dashboardRegistry.map((dashboard) => dashboard.path);

        expect(paths).toEqual(
            expect.arrayContaining([
                "/playground",
                "/counter",
                "/wallet",
                "/devotional",
                "/reading",
            ]),
        );
    });

    it("defines route-local navigation for order-owned apps", () => {
        expect(devotionalNavigation.title).toBe("Devotional");
        expect(devotionalNavigation.groups.map((group) => group.id)).toEqual(
            expect.arrayContaining(["ram", "shiv", "ganesh"]),
        );
        expect(devotionalNavigation.groups[0].items.map((item) => item.href)).toContain(
            "/devotional/ram/strotram",
        );

        expect(walletNavigation.title).toBe("Wallet");
        expect(walletNavigation.groups.map((group) => group.title)).toEqual(
            expect.arrayContaining(["Wallet", "Assets", "Settings"]),
        );
        expect(
            walletNavigation.groups.some((group) =>
                group.items.some((item) => item.href === "/wallet/goals"),
            ),
        ).toBe(true);

        expect(readingNavigation.title).toBe("Reading");
        expect(readingNavigation.groups[0].items[0].href).toBe("/reading");
    });

    it("validates server session state and role access rules", () => {
        const user = parseSessionUser(JSON.stringify({ id: "user-1", name: "Ada", role: "user" }));

        expect(parseSessionUser(undefined)).toBeNull();
        expect(user).toEqual({
            id: "user-1",
            name: "Ada",
            role: "user",
            isAuthenticated: true,
        });
        expect(hasRole(user, "user")).toBe(true);
        expect(hasRole(user, "admin")).toBe(false);
        expect(canAccessRoute(user, "user")).toBe(true);
        expect(canAccessRoute(user, "admin")).toBe(false);
        expect(resolveRouteAccessRule("/wallet/goals")).toEqual({
            path: "/wallet/goals",
            requiredRole: "user",
        });
        expect(isRouteAllowed("/wallet/goals", user)).toBe(true);
        expect(isRouteAllowed("/wallet/goals", null)).toBe(false);
        expect(isRouteAllowed("/devotional/ram", user)).toBe(true);

        expect(() => assertRouteAccess("/wallet/goals", null)).toThrow("Forbidden");
    });

    it("keeps the desktop sidebar in the page flow instead of covering the top header", () => {
        const closed = getSidebarClasses(false, "bg-slate-900");
        const open = getSidebarClasses(true, "bg-slate-900");

        expect(closed).toContain("lg:sticky");
        expect(closed).toContain("lg:static");
        expect(closed).not.toContain("lg:fixed");
        expect(closed).toContain("lg:w-20");
        expect(open).toContain("lg:w-64");
    });
});
