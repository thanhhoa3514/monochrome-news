import type { ApiClient } from "@/lib/api/types";
import type {
    DigestPreviewResponse,
    NotificationListResponse,
    NotificationPreferences,
} from "@/types/notification";
import type {
    AppNotification,
    DigestPreferences,
    DigestPreviewResponse as AppDigestPreviewResponse,
    NotificationReadResponse,
    UpdateDigestPreferencesInput,
} from "@/types/engagement";

function buildListQuery(page: number, perPage: number): string {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    return params.toString();
}

function buildDigestQuery(options?: { frequency?: "off" | "daily" | "weekly"; limit?: number }): string {
    const params = new URLSearchParams();

    if (options?.frequency) {
        params.set("frequency", options.frequency);
    }

    if (options?.limit) {
        params.set("limit", String(options.limit));
    }

    return params.toString();
}

export function createNotificationApi(client: ApiClient) {
    return {
        async list(page = 1, perPage = 10): Promise<{ data: AppNotification[]; unread_count: number }> {
            const response = await client.request<NotificationListResponse>(`/notifications?${buildListQuery(page, perPage)}`);

            return {
                unread_count: response.unread_count,
                data: response.data.map((notification) => ({
                    id: notification.id,
                    type: notification.type,
                    title: notification.title,
                    body: notification.message ?? "",
                    cta_url: notification.link ?? null,
                    data: notification.data,
                    read_at: notification.read_at ?? null,
                    created_at: notification.created_at ?? new Date().toISOString(),
                })),
            };
        },

        async markRead(notificationId: string | number): Promise<NotificationReadResponse> {
            return client.request<NotificationReadResponse>(`/notifications/${notificationId}/read`, { method: "POST" });
        },

        async markAsRead(notificationId: string | number): Promise<NotificationReadResponse> {
            return client.request<NotificationReadResponse>(`/notifications/${notificationId}/read`, { method: "POST" });
        },

        markAllRead: () =>
            client.request<{ message: string }>("/notifications/read-all", { method: "POST" }),

        markAllAsRead() {
            return client.request<{ message: string }>("/notifications/read-all", { method: "POST" });
        },

        async getDigestPreview(options?: { frequency?: "off" | "daily" | "weekly"; limit?: number }): Promise<AppDigestPreviewResponse> {
            const query = buildDigestQuery(options);
            return client.request<DigestPreviewResponse>(
                query ? `/notifications/digest-preview?${query}` : "/notifications/digest-preview"
            );
        },
    };
}

function mapPreferences(preferences: NotificationPreferences): DigestPreferences {
    return {
        email_enabled: preferences.email_notifications_enabled,
        digest_frequency: preferences.digest_frequency,
    };
}

export function createPreferenceApi(client: ApiClient) {
    return {
        async getDigestPreferences(): Promise<DigestPreferences> {
            const preferences = await client.request<NotificationPreferences>("/notifications/preferences");
            return mapPreferences(preferences);
        },

        async updateDigestPreferences(input: UpdateDigestPreferencesInput): Promise<DigestPreferences> {
            const response = await client.request<{ message: string; preferences: NotificationPreferences }>("/notifications/preferences", {
                method: "PATCH",
                body: {
                    email_notifications_enabled: input.email_enabled,
                    digest_frequency: input.digest_frequency,
                },
            });

            return mapPreferences(response.preferences);
        },
    };
}
