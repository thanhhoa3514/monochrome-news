import type { ApiClient } from "@/lib/api/types";
import type { FollowCollection } from "@/types/engagement";

export function createFollowApi(client: ApiClient) {
    return {
        list: () => client.request<FollowCollection>("/follows"),
        followCategory: (categoryId: number) =>
            client.request<{ message: string }>(`/follows/categories/${categoryId}`, { method: "POST" }),
        unfollowCategory: (categoryId: number) =>
            client.request<{ message: string }>(`/follows/categories/${categoryId}`, { method: "DELETE" }),
        followTag: (tagId: number) =>
            client.request<{ message: string }>(`/follows/tags/${tagId}`, { method: "POST" }),
        unfollowTag: (tagId: number) =>
            client.request<{ message: string }>(`/follows/tags/${tagId}`, { method: "DELETE" }),
    };
}
