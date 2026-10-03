export type UserRole = "guest" | "user" | "admin";

export type AuthUser = {
    id: string;
    name: string;
    email?: string;
    role: UserRole;
    isAuthenticated: true;
};

export const SESSION_COOKIE_NAME = "next-ui-playground-session";

const roleRank: Record<UserRole, number> = {
    guest: 0,
    user: 1,
    admin: 2,
};

export function parseSessionUser(rawValue: string | undefined): AuthUser | null {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue) as Partial<AuthUser>;
        const id = typeof parsed.id === "string" ? parsed.id : "";
        const name = typeof parsed.name === "string" ? parsed.name : "";
        const email = typeof parsed.email === "string" ? parsed.email : undefined;
        const role = parsed.role === "guest" || parsed.role === "user" || parsed.role === "admin" ? parsed.role : "guest";

        if (!id || !name) {
            return null;
        }

        return {
            id,
            name,
            email,
            role,
            isAuthenticated: true,
        };
    } catch {
        return null;
    }
}

export function hasRole(user: AuthUser | null, requiredRole: UserRole): boolean {
    if (!user) {
        return false;
    }

    return (roleRank[user.role] ?? 0) >= (roleRank[requiredRole] ?? 0);
}

export function canAccessRoute(user: AuthUser | null, requiredRole: UserRole = "guest") {
    if (requiredRole === "guest") {
        return true;
    }

    return hasRole(user, requiredRole);
}

export type RouteAccessRule = {
    path: string;
    requiredRole: UserRole;
};

export const routeAccessRules: RouteAccessRule[] = [
    { path: "/", requiredRole: "guest" },
    { path: "/counter", requiredRole: "guest" },
    { path: "/devotional", requiredRole: "guest" },
    { path: "/playground", requiredRole: "guest" },
    { path: "/reading", requiredRole: "guest" },
    { path: "/wallet", requiredRole: "user" },
    { path: "/wallet/goals", requiredRole: "user" },
    { path: "/wallet/asset-allocation", requiredRole: "user" },
    { path: "/wallet/preferences", requiredRole: "user" },
];

export function resolveRouteAccessRule(pathname: string): RouteAccessRule {
    const matches = routeAccessRules.filter(
        (rule) => pathname === rule.path || pathname.startsWith(`${rule.path}/`),
    );

    const match = matches.sort((a, b) => b.path.length - a.path.length)[0];
    return match ?? { path: pathname, requiredRole: "guest" };
}

export function isRouteAllowed(pathname: string, user: AuthUser | null): boolean {
    const rule = resolveRouteAccessRule(pathname);
    return canAccessRoute(user, rule.requiredRole);
}

export function assertRouteAccess(pathname: string, user: AuthUser | null): void {
    if (!isRouteAllowed(pathname, user)) {
        throw new Error("Forbidden");
    }
}
