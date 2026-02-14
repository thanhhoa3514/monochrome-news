import { createNewsApi } from "@/lib/api/news";
import { serverApiClient } from "@/lib/server-api";

export const serverNewsService = createNewsApi(serverApiClient);
