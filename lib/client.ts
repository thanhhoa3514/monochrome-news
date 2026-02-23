/**
 * Client-side API service instances.
 * Import from "@/lib/client" in any Client Component ("use client").
 *
 * These are pre-wired to use the client API client (which attaches
 * the auth_token from localStorage automatically).
 */
"use client";

import { clientApiClient } from "@/lib/client-api";
import { createAuthApi } from "@/lib/api/auth";
import { createNewsApi } from "@/lib/api/news";
import { createUserApi } from "@/lib/api/users";
import { createTagApi } from "@/lib/api/tags";
import { createPermissionApi } from "@/lib/api/permissions";

// ─── Auth ────────────────────────────────────────────
export const clientAuthService = createAuthApi(clientApiClient);

// ─── News ────────────────────────────────────────────
export const clientNewsService = createNewsApi(clientApiClient);

// ─── Users ───────────────────────────────────────────
export const clientUserService = createUserApi(clientApiClient);

// ─── Tags ────────────────────────────────────────────
export const clientTagService = createTagApi(clientApiClient);

// ─── Permissions ─────────────────────────────────────
export const clientPermissionService = createPermissionApi(clientApiClient);
