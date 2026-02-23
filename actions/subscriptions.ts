"use server";

import { revalidatePath } from "next/cache";
import { serverApiClient } from "@/lib/server-api";

export async function cancelSubscriptionAction(id: number) {
    try {
        await serverApiClient.request(`/subscriptions/${id}/cancel`, { method: "POST" });
        revalidatePath("/admin/subscriptions");
        return { success: true };
    } catch (error) {
        console.error("Failed to cancel subscription:", error);
        return { success: false, error: "Failed to cancel subscription" };
    }
}

export async function activateSubscriptionAction(id: number) {
    try {
        await serverApiClient.request(`/subscriptions/${id}/activate`, { method: "POST" });
        revalidatePath("/admin/subscriptions");
        return { success: true };
    } catch (error) {
        console.error("Failed to activate subscription:", error);
        return { success: false, error: "Failed to activate subscription" };
    }
}
