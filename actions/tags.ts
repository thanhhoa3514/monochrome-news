"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "@/lib/server-api";
import { createTagApi } from "@/lib/api/tags";
import { CreateTagInput, UpdateTagInput } from "@/types/tag";

const tagsApi = createTagApi(serverApiClient);

export async function createTagAction(data: CreateTagInput) {
    try {
        const result = await tagsApi.createTag(data);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to create tag:", error);
        return { success: false, error: error.message || "Failed to create tag" };
    }
}

export async function updateTagAction(id: number, data: UpdateTagInput) {
    try {
        const result = await tagsApi.updateTag(id, data);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to update tag:", error);
        return { success: false, error: error.message || "Failed to update tag" };
    }
}

export async function deleteTagAction(id: number) {
    try {
        await tagsApi.deleteTag(id);
        revalidatePath("/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete tag:", error);
        return { success: false, error: error.message || "Failed to delete tag" };
    }
}
