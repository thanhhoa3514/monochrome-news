import type { ApiClient } from "@/lib/api/types";
import { UserListItem, PaginatedUserResponse, CreateUserInput, UpdateUserInput } from "@/types/user";

export function createUserApi(client: ApiClient) {
    return {
        getUsers: (page: number = 1, perPage: number = 10, role?: string) => {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("per_page", String(perPage));

            if (role) {
                params.set("role", role);
            }

            return client.request<PaginatedUserResponse>(`/users?${params.toString()}`);
        },

        getUserById: (id: number) =>
            client.request<UserListItem>(`/users/${id}`),

        createUser: (user: CreateUserInput) =>
            client.request<UserListItem>(`/users`, { method: "POST", body: user }),

        updateUser: (id: number, user: UpdateUserInput) =>
            client.request<UserListItem>(`/users/${id}`, { method: "PUT", body: user }),

        deleteUser: (id: number) =>
            client.request<void>(`/users/${id}`, { method: "DELETE" }),
    };
}
