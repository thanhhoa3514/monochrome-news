"use server";

import { serverApiClient } from "@/lib/server-api";

export async function updateProfileAction(formData: FormData) {
    try {
        const result = await serverApiClient.request<{ user: any }>("/user/profile", {
            method: "POST",
            body: formData,
        });
        return { success: true, user: result.user };
    } catch (error: any) {
        console.error("Failed to update profile:", error);
        return { success: false, error: error.message || "Failed to update profile" };
    }
}

export async function changePasswordAction(currentPassword: string, newPassword: string, confirmPassword: string) {
    try {
        await serverApiClient.request("/user/password", {
            method: "PUT",
            body: {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
            },
        });
        return { success: true };
    } catch (error: any) {
        console.error("Failed to change password:", error);
        return { success: false, error: error.message || "Failed to change password" };
    }
}
