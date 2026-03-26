/**
 * Server-side API service instances.
 * Import from "@/lib/server" in any Server Component or Server Action.
 *
 * These are pre-wired to use the server API client (which attaches
 * cookies / auth headers automatically via Next.js headers()).
 */
import "server-only";

import { serverApiClient } from "@/lib/server-api";
import { createNewsApi } from "@/lib/api/news";
import { createTagApi } from "@/lib/api/tags";
import { createUserApi } from "@/lib/api/users";
import { createPermissionApi } from "@/lib/api/permissions";
import type { AuthenticatedUserResponse } from "@/types/auth/auth";

// ─── News ────────────────────────────────────────────
export const serverNewsService = createNewsApi(serverApiClient);

// ─── Tags ────────────────────────────────────────────
export const serverTagService = createTagApi(serverApiClient);

// ─── Users ───────────────────────────────────────────
export const serverUserService = createUserApi(serverApiClient);

// ─── Permissions ─────────────────────────────────────
export const serverPermissionService = createPermissionApi(serverApiClient);

// ─── Auth ────────────────────────────────────────────
export const serverAuthService = {
    async me() {
        try {
            const response = await serverApiClient.request<AuthenticatedUserResponse>("/auth/me");
            return response.user;
        } catch {
            return null;
        }
    },
};
