import { Tag, CreateTagInput, UpdateTagInput, TagQueryParams, PaginatedTagResponse } from '@/types/tag';
import { API_URL } from '@/config/environment';

const API_BASE_URL = `${API_URL}/api/v1`;

export const tagService = {
    /**
     * Get tags with pagination and filtering
     */
    async getTags(params: TagQueryParams = {}): Promise<PaginatedTagResponse | Tag[]> {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page.toString());
        if (params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params.q) queryParams.append('q', params.q);
        if (params.all) queryParams.append('all', '1');

        const response = await fetch(`${API_BASE_URL}/tags?${queryParams.toString()}`, {
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }

        return response.json();
    },

    /**
     * Get a single tag by ID
     */
    async getTag(id: number): Promise<Tag> {
        const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tag');
        }

        return response.json();
    },

    /**
     * Create a new tag
     */
    async createTag(data: CreateTagInput): Promise<Tag> {
        const response = await fetch(`${API_BASE_URL}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create tag');
        }

        return response.json();
    },

    /**
     * Update an existing tag
     */
    async updateTag(id: number, data: UpdateTagInput): Promise<Tag> {
        const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update tag');
        }

        return response.json();
    },

    /**
     * Delete a tag
     */
    async deleteTag(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete tag');
        }
    }
};
