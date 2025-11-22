import { News, Category, PaginatedResponse, NewsQueryParams } from '@/types/news';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const newsService = {
    async getNews(params: NewsQueryParams = {}): Promise<PaginatedResponse<News>> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params.category_id) queryParams.append('category_id', params.category_id.toString());
        if (params.is_premium !== undefined) queryParams.append('is_premium', params.is_premium.toString());

        let endpoint = '/news';

        // If there's a search query, use the search endpoint
        if (params.q) {
            queryParams.append('q', params.q);
            endpoint = '/news/search';
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        return response.json();
    },

    async getCategories(): Promise<Category[]> {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return response.json();
    },

    async getNewsById(id: number | string): Promise<News> {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('News not found');
            }
            throw new Error('Failed to fetch news detail');
        }

        return response.json();
    },

    async getNewsByCategorySlug(slug: string, page: number = 1): Promise<PaginatedResponse<News>> {
        const response = await fetch(`${API_BASE_URL}/categories/${slug}/news?page=${page}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch news by category');
        }

        return response.json();
    },

    async getFeaturedNews(): Promise<News[]> {
        // Fetch latest 5 news for carousel/featured section
        const response = await this.getNews({ per_page: 5 });
        return response.data;
    },

    async getLatestNews(): Promise<News[]> {
        const response = await this.getNews({ per_page: 6 });
        return response.data;
    },

    async getPopularNews(): Promise<News[]> {
        // Ideally backend should support sorting by views
        // For now, just fetching some news
        const response = await this.getNews({ per_page: 4 });
        return response.data;
    }
};
