import type { ApiClient } from "@/lib/api/types";
import type { Plan } from "@/types/plan";

export function createPlanApi(client: ApiClient) {
  return {
    list: (status?: string) =>
      client.request<Plan[]>(status ? `/plans?status=${encodeURIComponent(status)}` : "/plans"),

    get: (id: number | string) =>
      client.request<Plan>(`/plans/${id}`),
  };
}
