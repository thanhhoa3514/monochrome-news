/**
 * Server-side API service instances.
 * Import from "@/lib/server" in any Server Component or Server Action.
 *
 * These are pre-wired to use the server API client (which attaches
 * cookies / auth headers automatically via Next.js headers()).
 */
import "server-only";

import { authenticatedServerApiClient, publicServerApiClient } from "@/lib/server-api";
import { createNewsApi } from "@/lib/api/news";
import { createTagApi } from "@/lib/api/tags";
import { createUserApi } from "@/lib/api/users";
import { createPermissionApi } from "@/lib/api/permissions";
import type { AuthenticatedUserResponse } from "@/types/auth/auth";

// ─── Public News ─────────────────────────────────────
export const serverNewsService = createNewsApi(publicServerApiClient);
export const authenticatedServerNewsService = createNewsApi(authenticatedServerApiClient);

// ─── Tags ────────────────────────────────────────────
export const serverTagService = createTagApi(publicServerApiClient);
export const authenticatedServerTagService = createTagApi(authenticatedServerApiClient);

// ─── Users ───────────────────────────────────────────
export const serverUserService = createUserApi(authenticatedServerApiClient);

// ─── Permissions ─────────────────────────────────────
export const serverPermissionService = createPermissionApi(authenticatedServerApiClient);

// ─── Auth ────────────────────────────────────────────
export const serverAuthService = {
    async me() {
        try {
            const response = await authenticatedServerApiClient.request<AuthenticatedUserResponse>("/auth/me");
            return response.user;
        } catch {
            return null;
        }
    },
};
