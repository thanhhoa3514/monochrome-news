export type FollowTargetType = "category" | "tag";

export type DigestFrequency = "off" | "daily" | "weekly";

export interface FollowTopic {
  id: number;
  name: string;
  slug: string;
  article_count?: number;
}

export interface FollowCollection {
  categories: FollowTopic[];
  tags: FollowTopic[];
}

export interface AppNotification {
  id: number | string;
  type: string;
  title: string;
  body: string;
  cta_url?: string | null;
  data?: Record<string, unknown> | null;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  data: AppNotification[];
  unread_count: number;
}

export interface NotificationReadResponse {
  message?: string;
  notification?: AppNotification;
}

export interface DigestPreferences {
  email_enabled: boolean;
  digest_frequency: DigestFrequency;
}

export interface UpdateDigestPreferencesInput {
  email_enabled: boolean;
  digest_frequency: DigestFrequency;
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
  frequency: DigestFrequency;
  generated_at: string;
  window_start?: string | null;
  articles: DigestPreviewArticle[];
}
