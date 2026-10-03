import { cookies } from "next/headers";

export type { AuthUser, RouteAccessRule, UserRole } from "./session-helpers";
export {
    assertRouteAccess,
    canAccessRoute,
    hasRole,
    isRouteAllowed,
    parseSessionUser,
    resolveRouteAccessRule,
    routeAccessRules,
    SESSION_COOKIE_NAME,
} from "./session-helpers";

import { hasRole, parseSessionUser, SESSION_COOKIE_NAME, type AuthUser, type UserRole } from "./session-helpers";

export async function getSessionUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    return parseSessionUser(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireSessionUser(requiredRole: UserRole = "user"): Promise<AuthUser> {
    const user = await getSessionUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    if (!hasRole(user, requiredRole)) {
        throw new Error("Forbidden");
    }

    return user;
}
