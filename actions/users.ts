"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "@/lib/server-api";
import { createUserApi } from "@/lib/api/users";

const usersApi = createUserApi(serverApiClient);

export async function createUserAction(data: { name: string; email: string; password: string; role_ids?: number[] }) {
    try {
        const result = await usersApi.createUser(data);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to create user:", error);
        return { success: false, error: error.message || "Failed to create user" };
    }
}

export async function updateUserAction(id: number, data: { name?: string; email?: string; password?: string; role_ids?: number[] }) {
    try {
        const result = await usersApi.updateUser(id, data);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to update user:", error);
        return { success: false, error: error.message || "Failed to update user" };
    }
}

export async function deleteUserAction(id: number) {
    try {
        await usersApi.deleteUser(id);
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete user:", error);
        return { success: false, error: error.message || "Failed to delete user" };
    }
}
