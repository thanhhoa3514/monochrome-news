"use client";

import { createNewsApi } from "@/lib/api/news";
import { clientApiClient } from "@/lib/client-api";

export const clientNewsService = createNewsApi(clientApiClient);
