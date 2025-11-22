import { Plan } from '@/types/plan';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const planService = {
    async getPlans(): Promise<Plan[]> {
        const response = await fetch(`${API_BASE_URL}/plans`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch plans');
        }

        return response.json();
    },

    async getPlan(id: number): Promise<Plan> {
        const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch plan');
        }

        return response.json();
    }
};
