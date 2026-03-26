"use server";

import { cookies } from "next/headers";
import { API_BASE_URL, API_PREFIX, AUTH_COOKIE_NAME } from "@/lib/api/config";
import type { LoginCredentials, AuthResponse, RegisterData, User } from "@/types/auth/auth";

type AuthActionResult = {
    success: boolean;
    user?: User;
    message?: string;
    error?: string;
};

async function persistAuthCookie(token: string, expiresIn?: number) {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: expiresIn ?? 7 * 24 * 60 * 60,
    });
}

async function requestAuth(
    path: string,
    payload: unknown,
): Promise<{ response: Response; result: Partial<AuthResponse> & { message?: string } }> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
    });

    const result = await response.json();

    return { response, result };
}

export async function loginAction(credentials: LoginCredentials): Promise<AuthActionResult> {
    try {
        const { response, result } = await requestAuth("/auth/login", {
            ...credentials,
            use_cookies: true,
        });

        if (!response.ok) {
            return { success: false, error: result.message || "Login failed" };
        }

        if (result.token && result.user) {
            persistAuthCookie(result.token, result.expires_in);
            return { success: true, user: result.user, message: result.message };
        }

        return { success: false, error: "Authentication token missing from response" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    try {
        if (token) {
            await fetch(`${API_BASE_URL}${API_PREFIX}/auth/logout`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });
        }
    } finally {
        cookieStore.delete(AUTH_COOKIE_NAME);
    }

    return { success: true };
}

export async function registerAction(data: RegisterData): Promise<AuthActionResult> {
    try {
        const { response, result } = await requestAuth("/auth/register", data);

        if (!response.ok) {
            return { success: false, error: result.message || "Registration failed" };
        }

        if (result.token && result.user) {
            persistAuthCookie(result.token, result.expires_in);
            return { success: true, user: result.user, message: result.message };
        }

        return { success: false, error: "Authentication token missing from registration response" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred during registration" };
    }
}
