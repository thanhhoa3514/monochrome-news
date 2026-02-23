"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "@/lib/server-api";
import { createNewsApi } from "@/lib/api/news";

const newsApi = createNewsApi(serverApiClient);

export async function deleteArticleAction(id: number) {
    try {
        await newsApi.deleteNews(id);
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete article:", error);
        return { success: false, error: "Failed to delete article" };
    }
}

export async function createArticleAction(formData: FormData) {
    try {
        const result = await newsApi.createNews(formData);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to create article:", error);
        return { success: false, error: "Failed to create article" };
    }
}

export async function updateArticleAction(id: number, formData: FormData) {
    try {
        const result = await newsApi.updateNews(id, formData);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to update article:", error);
        return { success: false, error: "Failed to update article" };
    }
}
