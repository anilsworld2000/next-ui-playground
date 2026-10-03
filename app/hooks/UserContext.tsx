"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { parseSessionUser, SESSION_COOKIE_NAME, type AuthUser } from "@/app/auth/session-helpers";

export type ProfileUser = {
    name: string;
    email?: string;
    avatarUrl?: string;
};

interface UserContextType {
    user: ProfileUser | null;
    setUser: (user: ProfileUser | null) => void;
    signOut: () => void;
    refreshUserFromSession: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function getSessionCookieUser(): ProfileUser | null {
    if (typeof document === "undefined") {
        return null;
    }

    const rawValue = document.cookie
        .split(";")
        .map((entry) => entry.trim())
        .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`));

    const value = rawValue ? rawValue.split("=").slice(1).join("=") : undefined;
    const sessionUser = parseSessionUser(value ? decodeURIComponent(value) : undefined) as AuthUser | null;

    if (!sessionUser) {
        return null;
    }

    return {
        name: sessionUser.name,
        email: sessionUser.email,
        avatarUrl: undefined,
    };
}

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<ProfileUser | null>(null);

    const refreshUserFromSession = () => {
        setUser(getSessionCookieUser());
    };

    useEffect(() => {
        refreshUserFromSession();
    }, []);

    const signOut = () => {
        setUser(null);
        document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    };

    return (
        <UserContext.Provider value={{ user, setUser, signOut, refreshUserFromSession }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}

// NOTE: This hook stores presentation data only. Authentication and authorization must be decided on the server in app/auth/session.ts.