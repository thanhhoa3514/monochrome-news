"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "@/lib/server-api";
import { createNewsApi } from "@/lib/api/news";

const newsApi = createNewsApi(serverApiClient);

export async function generateAiNewsAction(params: {
    category: string;
    count: number;
    language: string;
    tone: string;
    length: string;
    prompt?: string;
}) {
    try {
        const result = await newsApi.generateAiNews(params);
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to generate AI news:", error);
        return { success: false, error: error.message || "Failed to generate articles" };
    }
}

export async function publishAiArticleAction(params: {
    generation_id: string;
    article_index: number;
    category_id: number;
    user_id: number;
}) {
    try {
        const result = await serverApiClient.request<any>("/news/publish-ai", {
            method: "POST",
            body: params,
        });
        revalidatePath("/admin");
        return { success: true, data: result };
    } catch (error: any) {
        console.error("Failed to publish AI article:", error);
        return { success: false, error: error.message || "Failed to publish article" };
    }
}

export async function fetchAiHistoryAction() {
    try {
        const result = await serverApiClient.request<{ data: any[] }>("/ai-generations");
        return { success: true, data: Array.isArray(result.data) ? result.data : [] };
    } catch (error: any) {
        console.error("Failed to fetch AI history:", error);
        return { success: false, data: [], error: error.message || "Failed to fetch history" };
    }
}
