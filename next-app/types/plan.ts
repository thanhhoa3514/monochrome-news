export interface Plan {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    duration_days: number;
    features?: string[]; // Assuming features might be a JSON column or related
    created_at: string;
    updated_at: string;
}
