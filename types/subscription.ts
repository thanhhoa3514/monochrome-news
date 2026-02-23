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