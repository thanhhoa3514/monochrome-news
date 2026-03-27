export interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    duration_days: number;
    features?: string[]; // Assuming features might be a JSON column or related
    status?: 'active' | 'inactive';
    access_limit?: number | null;
    subscriptions_count?: number;
    created_at: string;
    updated_at: string;
}
