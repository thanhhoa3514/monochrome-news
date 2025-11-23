import { User } from './auth/auth';

export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
    news_count?: number;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface News {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    user_id: number;
    category_id: number;
    published_at: string | null;
    is_premium: boolean;
    views: number;
    created_at: string;
    updated_at: string;
    category?: Category;
    user?: User;
    tags?: Tag[];
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export interface NewsQueryParams {
    page?: number;
    per_page?: number;
    category_id?: number;
    is_premium?: boolean;
    q?: string; // search query
    tag_id?: number; // filter by tag
}

export interface CreateNewsInput {
    title: string;
    slug: string;
    content: string;
    category_id: number;
    user_id: number;
    is_premium: boolean;
    published_at: string;
    thumbnail?: string;
    summary?: string; // Optional, if backend supports it
}
export interface AdminNewsQueryParams extends NewsQueryParams {
    status?: string;
}
