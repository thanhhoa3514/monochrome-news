import React from 'react';
import AdminTagsClient from './AdminTagsClient';
import { authenticatedServerTagService } from '@/lib/server';
import { PaginatedTagResponse, Tag } from '@/types/tag';

interface AdminTagsProps {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function AdminTags({ searchParams }: AdminTagsProps) {
    let initialTags: Tag[] = [];
    let currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
    let totalPages = 1;

    try {
        const response = await authenticatedServerTagService.getTags({ page: currentPage, per_page: 10 }) as PaginatedTagResponse;
        if (Array.isArray(response)) {
            initialTags = response;
        } else {
            initialTags = response.data;
            currentPage = response.current_page;
            totalPages = response.last_page;
        }
    } catch (error) {
        console.error('Failed to fetch initial tags:', error);
    }

    return <AdminTagsClient initialTags={initialTags} currentPage={currentPage} totalPages={totalPages} />;
}
