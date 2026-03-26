import React from 'react';
import AdminArticlesClient from './AdminArticlesClient';
import { authenticatedServerNewsService, serverNewsService } from '@/lib/server';
import { PaginatedResponse, News, Category } from '@/types/news';

export default async function AdminArticles() {
    let articles: News[] = [];
    let totalPages = 1;
    let currentPage = 1;
    let categories: Category[] = [];

    try {
        const [newsResponse, categoriesData] = await Promise.all([
            authenticatedServerNewsService.getAllNews({ page: 1, per_page: 50 }) as Promise<PaginatedResponse<News>>,
            serverNewsService.getCategories(),
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
