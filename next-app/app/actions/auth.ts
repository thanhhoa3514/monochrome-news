"use server";

import { cookies } from "next/headers";
import { API_BASE_URL, API_PREFIX, AUTH_COOKIE_NAME } from "@/lib/api/config";
import type { LoginCredentials, AuthResponse } from "../../../src/types/auth/auth";

export async function loginAction(credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthResponse['user']; error?: string }> {
    const loginUrl = `${API_BASE_URL}${API_PREFIX}/auth/login`;

    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ ...credentials, use_cookies: true }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || "Login failed" };
        }

        if (result.token) {
            cookies().set(AUTH_COOKIE_NAME, result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
            return { success: true, user: result.user };
        }

        return { success: false, error: "Token missing from response" };
    } catch (error: any) {
        return { success: false, error: error.message || "An unexpected error occurred" };
    }
}

export async function logoutAction() {
    cookies().delete(AUTH_COOKIE_NAME);
    return { success: true };
}
