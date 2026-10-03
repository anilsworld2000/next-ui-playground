"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, type AuthUser, type UserRole } from "@/app/auth/session";

export async function signIn(formData: FormData) {
    const name = String(formData.get("name") ?? "Demo User").trim() || "Demo User";
    const roleValue = String(formData.get("role") ?? "user");
    const role: UserRole = roleValue === "admin" ? "admin" : "user";

    const user: AuthUser = {
        id: `demo-${Date.now()}`,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@demo.local`,
        role,
        isAuthenticated: true,
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(user), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    redirect("/wallet");
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect("/");
}
