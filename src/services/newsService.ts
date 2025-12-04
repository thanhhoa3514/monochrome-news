import {
  News,
  Category,
  PaginatedResponse,
  NewsQueryParams,
} from "@/types/news";
import { API_URL } from "@/config/environment";
import { CreateNewsInput } from "@/types/news";
import { AdminNewsQueryParams } from "@/types/news";
const API_BASE_URL = `${API_URL}/api/v1`;
export const newsService = {
  /**
   * Get news
   * @param params news query params
   * @returns paginated news
   */
  async getNews(
    params: NewsQueryParams = {}
  ): Promise<PaginatedResponse<News>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params.category_id)
      queryParams.append("category_id", params.category_id.toString());
    if (params.is_premium !== undefined)
      queryParams.append("is_premium", params.is_premium.toString());
    if (params.tag_id) queryParams.append("tag_id", params.tag_id.toString());

    let endpoint = "/news";

    // If there's a search query, use the search endpoint
    if (params.q) {
      queryParams.append("q", params.q);
      endpoint = "/news/search";
    }

    const response = await fetch(
      `${API_BASE_URL}${endpoint}?${queryParams.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    return response.json();
  },

  /**
   * Get categories
   * @returns categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return response.json();
  },

  /**
   * Get news by ID
   * @param id news ID
   * @returns news by ID
   */
  async getNewsById(id: number | string): Promise<News> {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("News not found");
      }
      throw new Error("Failed to fetch news detail");
    }

    return response.json();
  },

  /**
   * Get news by category slug
   * @param slug category slug
   * @param page page number
   * @returns news by category slug
   */
  async getNewsByCategorySlug(
    slug: string,
    page: number = 1
  ): Promise<PaginatedResponse<News>> {
    const response = await fetch(
      `${API_BASE_URL}/categories/${slug}/news?page=${page}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news by category");
    }

    return response.json();
  },

  /**
   * Get featured news
   * @returns featured news
   */
  async getFeaturedNews(): Promise<News[]> {
    // Fetch latest 5 news for carousel/featured section
    const response = await this.getNews({ per_page: 5 });
    return response.data;
  },

  /**
   * Get latest news
   * @returns latest news
   */
  async getLatestNews(): Promise<News[]> {
    const response = await this.getNews({ per_page: 6 });
    return response.data;
  },

  /**
   * Get popular news
   * @returns
   */
  async getPopularNews(): Promise<News[]> {
    // Ideally backend should support sorting by views
    // For now, just fetching some news
    const response = await this.getNews({ per_page: 4 });
    return response.data;
  },

  /**
   * Get news for admin
   * @param params
   * @returns
   */
  async getAdminNews(
    params: AdminNewsQueryParams = {}
  ): Promise<PaginatedResponse<News>> {
    const response = await this.getNews(params);
    return response;
  },

  /**
   * Generate AI news
   * @param params generation params
   * @returns generated articles
   */
  async generateAiNews(params: {
    category: string;
    count: number;
    language: string;
    tone: string;
    length: string;
    prompt?: string;
  }): Promise<{ data: any[]; generation_id?: string }> {
    const response = await fetch(`${API_BASE_URL}/news/ai-generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to generate news");
    }

    return response.json();
  },

  /**
   * Delete a news by ID
   * @param id news ID
   * @returns void
   */
  async deleteNews(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete news");
    }
  },
  /**
   * Create a news
   * @param news news data (CreateNewsInput or FormData for file uploads)
   * @returns created news
   */
  async createNews(news: CreateNewsInput | FormData): Promise<News> {
    const isFormData = news instanceof FormData;

    const response = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: isFormData
        ? {
            Accept: "application/json",
          }
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      credentials: "include",
      body: isFormData ? news : JSON.stringify(news),
    });

    if (!response.ok) {
      throw new Error("Failed to create news");
    }

    return response.json();
  },

  /**
   * Update a news
   * @param id news ID
   * @param news news data
   * @returns updated news
   */
  async updateNews(
    id: number,
    news: CreateNewsInput | FormData
  ): Promise<News> {
    const isFormData = news instanceof FormData;

    // For FormData with file uploads in Laravel, we must use POST with _method=PUT
    // because PHP doesn't parse multipart/form-data on PUT requests natively
    const method = isFormData ? "POST" : "PUT";

    if (isFormData) {
      news.append("_method", "PUT");
    }

    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: method,
      headers: isFormData
        ? {
            Accept: "application/json",
          }
        : {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      credentials: "include",
      body: isFormData ? news : JSON.stringify(news),
    });

    if (!response.ok) {
      throw new Error("Failed to update news");
    }

    return response.json();
  },

  /**
   * Get news by tag (id or slug)
   * @param idOrSlug tag id or slug
   * @param page page number
   * @returns tag info and paginated news
   */
  async getNewsByTag(
    idOrSlug: string | number,
    page: number = 1
  ): Promise<{
    tag: { id: number; name: string; slug: string; description?: string };
    news: PaginatedResponse<News>;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/tags/${idOrSlug}/news?page=${page}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news by tag");
    }

    return response.json();
  },
};
