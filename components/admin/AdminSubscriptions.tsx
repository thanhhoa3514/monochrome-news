import React from 'react';
import AdminSubscriptionsClient from '@/components/admin/AdminSubscriptionsClient';
import { serverApiClient } from '@/lib/server-api';
import { SubscriptionResponse } from '@/types/subscription';

export default async function AdminSubscriptions({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
    const status = typeof searchParams.status === 'string' ? searchParams.status : 'all';
    const plan_id = typeof searchParams.plan_id === 'string' ? searchParams.plan_id : 'all';

    let subscriptionResponse: SubscriptionResponse = {
        current_page: 1,
        data: [],
        total: 0,
        last_page: 1
    } as unknown as SubscriptionResponse;

    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('per_page', '10');
        if (status !== 'all') queryParams.append('status', status);
        if (plan_id !== 'all') queryParams.append('plan_id', plan_id);

        subscriptionResponse = await serverApiClient.request<SubscriptionResponse>(`/subscriptions?${queryParams.toString()}`);
    } catch (error) {
        console.error('Failed to fetch subscriptions data:', error);
    }

    return (
        <AdminSubscriptionsClient
            initialSubscriptions={subscriptionResponse.data}
            totalPages={subscriptionResponse.last_page || 1}
            currentPage={page}
            initialStatus={status}
            initialPlanId={plan_id}
        />
    );
}
