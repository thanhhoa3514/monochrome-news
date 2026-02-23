import type { ApiClient } from "@/lib/api/types";
import { UserListItem, PaginatedUserResponse, CreateUserInput, UpdateUserInput } from "@/types/user";

export function createUserApi(client: ApiClient) {
    return {
        getUsers: (page: number = 1, perPage: number = 10) =>
            client.request<PaginatedUserResponse>(`/users?page=${page}&per_page=${perPage}`),

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
