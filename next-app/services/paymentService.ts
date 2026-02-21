import { API_URL } from '@/config/environment';
import { getAuthHeadersWithJson } from './apiHelper';

export interface CheckoutSessionResponse {
    checkoutUrl: string;
    sessionId: string;
    subscriptionId: number;
}

export const paymentService = {
    createCheckoutSession: async (planId: number): Promise<CheckoutSessionResponse> => {
        const response = await fetch(`${API_URL}/api/v1/subscriptions/create-checkout-session`, {
            method: 'POST',
            headers: getAuthHeadersWithJson(),
            credentials: 'include',
            body: JSON.stringify({ plan_id: planId }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Failed to create checkout session' }));
            throw new Error(error.error || error.message || 'Failed to create checkout session');
        }

        return response.json();
    },
};
