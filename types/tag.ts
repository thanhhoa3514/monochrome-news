export interface Tag {
    id: number;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    news_count?: number; // Count of related articles
    created_at: string;
    updated_at: string;
}

export interface CreateTagInput {
    name: string;
    slug?: string;
    description?: string;
    color?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> { }

export interface TagQueryParams {
    page?: number;
    per_page?: number;
    q?: string; // search query
    all?: boolean; // if true, fetch all without pagination
}

export interface PaginatedTagResponse {
    current_page: number;
    data: Tag[];
    first_page_url: string;
    from: number;
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
    to: number;
    total: number;
}
