import React from 'react';
import AdminArticlesClient from './AdminArticlesClient';
import { serverApiClient } from '@/lib/server-api';
import { createNewsApi } from '@/lib/api/news';
import { PaginatedResponse, News, Category } from '@/types/news';

const newsApi = createNewsApi(serverApiClient);

export default async function AdminArticles() {
    let articles: News[] = [];
    let totalPages = 1;
    let currentPage = 1;
    let categories: Category[] = [];

    try {
        const [newsResponse, categoriesData] = await Promise.all([
            newsApi.getNews({ page: 1, per_page: 50 }) as Promise<PaginatedResponse<News>>,
            newsApi.getCategories(),
        ]);
        articles = newsResponse.data;
        totalPages = newsResponse.last_page;
        currentPage = newsResponse.current_page;
        categories = categoriesData;
    } catch (error) {
        console.error('Failed to fetch articles data:', error);
    }

    return (
        <AdminArticlesClient
            initialArticles={articles}
            totalPages={totalPages}
            currentPage={currentPage}
            categories={categories}
        />
    );
}
