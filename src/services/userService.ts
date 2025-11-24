import { API_URL } from '@/config/environment';

const API_BASE_URL = `${API_URL}/api/v1`;

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role_ids?: number[];
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    role_ids?: number[];
}

export interface UserListItem {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: {
        id: number;
        name: string;
        slug: string;
    }[];
}

export interface PaginatedUserResponse {
    current_page: number;
    data: UserListItem[];
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

export const userService = {
    /**
     * Get all users with pagination
     */
    async getUsers(page: number = 1, perPage: number = 10): Promise<PaginatedUserResponse> {
        const response = await fetch(`${API_BASE_URL}/users?page=${page}&per_page=${perPage}`, {
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return response.json();
    },

    /**
     * Get a single user by ID
     */
    async getUserById(id: number): Promise<UserListItem> {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return response.json();
    },

    /**
     * Create a new user
     */
    async createUser(user: CreateUserInput): Promise<UserListItem> {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        }

        return response.json();
    },

    /**
     * Update an existing user
     */
    async updateUser(id: number, user: UpdateUserInput): Promise<UserListItem> {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        return response.json();
    },

    /**
     * Delete a user
     */
    async deleteUser(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
    },
};
