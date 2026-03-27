import type { ApiClient } from "@/lib/api/types";
import type { CheckoutSessionResponse } from "@/types/payment";

export function createSubscriptionApi(client: ApiClient) {
  return {
    createCheckoutSession: (planId: number) =>
      client.request<CheckoutSessionResponse>("/subscriptions/create-checkout-session", {
        method: "POST",
        body: { plan_id: planId },
      }),
  };
}
