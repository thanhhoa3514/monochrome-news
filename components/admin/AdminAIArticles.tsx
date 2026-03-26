/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import AdminAIArticlesClient from './AdminAIArticlesClient';
import { authenticatedServerNewsService, serverNewsService } from '@/lib/server';
import { Category } from '@/types/news';

export default async function AdminAIArticles() {
    let categories: Category[] = [];
    let history: any[] = [];

    try {
        const fetchCategoriesPromise = serverNewsService.getCategories();
        const fetchHistoryPromise = authenticatedServerNewsService.getAiGenerations();

        const [categoriesResponse, historyResponse] = await Promise.all([
            fetchCategoriesPromise,
            fetchHistoryPromise
        ]);

        categories = categoriesResponse || [];
        history = Array.isArray(historyResponse?.data) ? historyResponse.data : [];
    } catch (error) {
        console.error('Failed to fetch initial AI configuration data:', error);
    }

    return <AdminAIArticlesClient initialCategories={categories} initialHistory={history} />;
}
