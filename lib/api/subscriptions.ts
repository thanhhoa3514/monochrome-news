import type { ApiClient } from "@/lib/api/types";
import type { CheckoutSessionResponse, PaymentProvider } from "@/types/payment";

export function createSubscriptionApi(client: ApiClient) {
  return {
    createCheckoutSession: (planId: number, provider: PaymentProvider) =>
      client.request<CheckoutSessionResponse>("/subscriptions/create-checkout-session", {
        method: "POST",
        body: { plan_id: planId, provider },
      }),
  };
}
