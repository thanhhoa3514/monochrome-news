import { API_URL } from '@/config/environment';

export interface Subscription {
    id: number;
    user_id: number;
    plan_id: number;
    status: 'active' | 'cancelled' | 'expired' | 'pending';
    start_date: string;
    end_date: string;
    payment_method: string;
    transaction_id: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    plan?: {
        id: number;
        name: string;
        price: number;
        currency: string;
        duration_days: number;
        type: 'free' | 'basic' | 'premium' | 'enterprise';
    };
}

export interface SubscriptionResponse {
    current_page: number;
    data: Subscription[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface SubscriptionParams {
    page?: number;
    per_page?: number;
    status?: string;
    plan_id?: string;
    search?: string; // Note: Backend doesn't support search yet, but we'll keep it for future
}

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
        const response = await fetch(`${API_URL}/subscriptions/${id}/activate`, {
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
    }
};

export default subscriptionService;
