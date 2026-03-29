export interface FollowedCategory {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
}

export interface FollowedTag {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
}

export interface FollowSummary {
    categories: FollowedCategory[];
    tags: FollowedTag[];
}

export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message?: string | null;
    link?: string | null;
    data: Record<string, unknown>;
    read_at?: string | null;
    created_at?: string | null;
}

export interface NotificationListResponse {
    data: NotificationItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
}

export interface NotificationPreferences {
    email_notifications_enabled: boolean;
    digest_frequency: "off" | "daily" | "weekly";
}

export interface DigestPreviewArticle {
    id: number;
    title: string;
    thumbnail?: string | null;
    published_at?: string | null;
    is_premium: boolean;
    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    tags: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    author?: {
        id: number;
        name: string;
    } | null;
}

export interface DigestPreviewResponse {
    frequency: "off" | "daily" | "weekly";
    generated_at: string;
    window_start?: string | null;
    articles: DigestPreviewArticle[];
}
