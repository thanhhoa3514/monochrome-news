/**
 * Client-side API service instances.
 * Import from "@/lib/client" in any Client Component ("use client").
 *
 * These are pre-wired to use the client API proxy, allowing browser
 * requests to authenticate through the Next.js httpOnly auth cookie.
 */
"use client";

import { clientApiClient } from "@/lib/client-api";
import { createAuthApi } from "@/lib/api/auth";
import { createNewsApi } from "@/lib/api/news";
import { createUserApi } from "@/lib/api/users";
import { createTagApi } from "@/lib/api/tags";
import { createPermissionApi } from "@/lib/api/permissions";
import { createPlanApi } from "@/lib/api/plans";
import { createSubscriptionApi } from "@/lib/api/subscriptions";
import { createFollowApi } from "@/lib/api/follows";
import { createNotificationApi, createPreferenceApi } from "@/lib/api/notifications";

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

// ─── Plans & Subscriptions ──────────────────────────
export const clientPlanService = createPlanApi(clientApiClient);
export const clientSubscriptionService = createSubscriptionApi(clientApiClient);

// ─── Reader Engagement ─────────────────────────────
export const clientFollowService = createFollowApi(clientApiClient);
export const clientNotificationService = createNotificationApi(clientApiClient);
export const clientPreferenceService = createPreferenceApi(clientApiClient);
