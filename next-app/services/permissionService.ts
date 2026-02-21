import { API_URL } from '@/config/environment';
import { getAuthHeaders, getAuthHeadersWithJson } from './apiHelper';

const API_BASE_URL = `${API_URL}/api/v1`;

import { Permission, Role } from '@/types/permissions';

export const permissionService = {
    async getRoles(): Promise<Role[]> {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch roles');
        }

        return response.json();
    },

    async getPermissions(): Promise<Permission[]> {
        const response = await fetch(`${API_BASE_URL}/permissions`, {
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch permissions');
        }

        return response.json();
    },

    async updateRole(id: number, data: { name?: string; description?: string; permissions?: number[] }): Promise<Role> {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'PUT',
            headers: getAuthHeadersWithJson(),
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update role');
        }

        return response.json();
    }
};
