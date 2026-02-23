import type { ApiClient } from "@/lib/api/types";
import { Permission, Role } from "@/types/permissions";

export function createPermissionApi(client: ApiClient) {
    return {
        getRoles: () =>
            client.request<Role[]>("/roles"),

        getPermissions: () =>
            client.request<Permission[]>("/permissions"),

        updateRole: (id: number, data: { name?: string; description?: string; permissions?: number[] }) =>
            client.request<Role>(`/roles/${id}`, { method: 'PUT', body: data }),
    };
}
