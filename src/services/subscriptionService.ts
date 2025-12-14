import { API_URL } from '@/config/environment';
import { Subscription, SubscriptionResponse, SubscriptionParams } from '@/types/subscription';

const subscriptionService = {
    getAll: async (params: SubscriptionParams = {}): Promise<SubscriptionResponse> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params.status && params.status !== 'all') queryParams.append('status', params.status);
        if (params.plan_id && params.plan_id !== 'all') queryParams.append('plan_id', params.plan_id);

        // Note: Search might need a separate endpoint or update to backend index method
        // For now we'll handle what we can

        const response = await fetch(`${API_URL}/subscriptions?${queryParams.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, // Fallback if cookie not working
                'Accept': 'application/json',
            },
            credentials: 'include' // Important for cookies
        });

        if (!response.ok) {
            throw new Error('Failed to fetch subscriptions');
        }

        return response.json();
    },

    cancel: async (id: number) => {
        const response = await fetch(`${API_URL}/subscriptions/${id}/cancel`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to cancel subscription');
        }

        return response.json();
    },

    activate: async (id: number) => {
        const response = await fetch(`${API_URL}/api/v1/subscriptions/${id}/activate`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to activate subscription');
        }

        return response.json();
    },

    // Get current user's active subscription
    getCurrentSubscription: async (): Promise<Subscription | null> => {
        try {
            const response = await fetch(`${API_URL}/api/v1/subscriptions?status=active&per_page=1`, {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                return null;
            }

            const data: SubscriptionResponse = await response.json();
            return data.data.length > 0 ? data.data[0] : null;
        } catch {
            return null;
        }
    }
};

export default subscriptionService;
