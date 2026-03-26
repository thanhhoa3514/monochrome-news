import React from 'react';
import AdminTagsClient from './AdminTagsClient';
import { authenticatedServerTagService } from '@/lib/server';
import { Tag } from '@/types/tag';

export default async function AdminTags() {
    let initialTags: Tag[] = [];

    try {
        const response = await authenticatedServerTagService.getTags({ per_page: 50 });
        if (Array.isArray(response)) {
            initialTags = response;
        } else {
            initialTags = response.data;
        }
    } catch (error) {
        console.error('Failed to fetch initial tags:', error);
    }

    return <AdminTagsClient initialTags={initialTags} />;
}
