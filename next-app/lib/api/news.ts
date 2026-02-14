import type { ApiClient } from "@/lib/api/types";

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug?: string;
  summary?: string;
  content?: string;
  thumbnail?: string;
  published_at?: string;
  category?: NewsCategory;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface NewsQueryParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  is_premium?: boolean;
  tag_id?: number;
  q?: string;
}

function toQueryString(params: NewsQueryParams = {}): string {
  const qs = new URLSearchParams();
  if (params.page) qs.append("page", String(params.page));
  if (params.per_page) qs.append("per_page", String(params.per_page));
  if (params.category_id) qs.append("category_id", String(params.category_id));
  if (typeof params.is_premium === "boolean") qs.append("is_premium", String(params.is_premium));
  if (params.tag_id) qs.append("tag_id", String(params.tag_id));
  if (params.q) qs.append("q", params.q);
  return qs.toString();
}

export function createNewsApi(client: ApiClient) {
  return {
    getCategories: () => client.request<NewsCategory[]>("/categories"),

    getNews: (params: NewsQueryParams = {}) => {
      const endpoint = params.q ? "/news/search" : "/news";
      const query = toQueryString(params);
      return client.request<PaginatedResponse<NewsItem>>(
        query ? `${endpoint}?${query}` : endpoint,
      );
    },

    getNewsById: (id: number | string) => client.request<NewsItem>(`/news/${id}`),

    getNewsByCategorySlug: (slug: string, page = 1) =>
      client.request<PaginatedResponse<NewsItem>>(`/categories/${slug}/news?page=${page}`),

    getNewsByTag: (idOrSlug: string | number, page = 1) =>
      client.request<{
        tag: { id: number; name: string; slug: string; description?: string };
        news: PaginatedResponse<NewsItem>;
      }>(`/tags/${idOrSlug}/news?page=${page}`),

    getFeaturedNews: async () => (await client.request<PaginatedResponse<NewsItem>>("/news?per_page=5")).data,
    getLatestNews: async () => (await client.request<PaginatedResponse<NewsItem>>("/news?per_page=6")).data,
    getPopularNews: async () => (await client.request<PaginatedResponse<NewsItem>>("/news?per_page=4")).data,
  };
}
