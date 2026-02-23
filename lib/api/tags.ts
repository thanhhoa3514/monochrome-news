import type { ApiClient } from "@/lib/api/types";
import { Tag, TagQueryParams, PaginatedTagResponse, CreateTagInput, UpdateTagInput } from "@/types/tag";

function toQueryString(params: TagQueryParams = {}): string {
    const qs = new URLSearchParams();
    if (params.page) qs.append("page", String(params.page));
    if (params.per_page) qs.append("per_page", String(params.per_page));
    if (params.q) qs.append("q", params.q);
    if (params.all) qs.append("all", "1");
    return qs.toString();
}

export function createTagApi(client: ApiClient) {
    return {
        getTags: (params: TagQueryParams = {}) => {
            const query = toQueryString(params);
            return client.request<PaginatedTagResponse | Tag[]>(
                query ? `/tags?${query}` : `/tags`
            );
        },

        getTag: (id: number) =>
            client.request<Tag>(`/tags/${id}`),

        createTag: (data: CreateTagInput) =>
            client.request<Tag>(`/tags`, { method: 'POST', body: data }),

        updateTag: (id: number, data: UpdateTagInput) =>
            client.request<Tag>(`/tags/${id}`, { method: 'PATCH', body: data }),

        deleteTag: (id: number) =>
            client.request<void>(`/tags/${id}`, { method: 'DELETE' }),
    };
}
