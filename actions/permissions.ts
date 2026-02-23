"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "@/lib/server-api";
import { createPermissionApi } from "@/lib/api/permissions";

const permissionsApi = createPermissionApi(serverApiClient);

export async function updateRoleAction(id: number, permissions: number[]) {
    try {
        await permissionsApi.updateRole(id, { permissions });
        revalidatePath("/admin/permissions");
        return { success: true };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { success: false, error: "Failed to update role" };
    }
}
