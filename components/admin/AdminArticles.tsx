import React from 'react';
import AdminArticlesClient from './AdminArticlesClient';
import { authenticatedServerNewsService, serverNewsService } from '@/lib/server';
import { PaginatedResponse, News, Category } from '@/types/news';

interface AdminArticlesProps {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function AdminArticles({ searchParams }: AdminArticlesProps) {
    let articles: News[] = [];
    let totalPages = 1;
    let currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
    let categories: Category[] = [];

    try {
        const status = typeof searchParams?.status === 'string' ? searchParams.status : undefined;
        const categoryId = typeof searchParams?.category === 'string' ? Number(searchParams.category) : undefined;
        const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

        const [newsResponse, categoriesData] = await Promise.all([
            authenticatedServerNewsService.getAllNews({
                page: currentPage,
                per_page: 10,
                status,
                category_id: Number.isNaN(categoryId) ? undefined : categoryId,
                q: query,
            }) as Promise<PaginatedResponse<News>>,
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
            initialStatus={typeof searchParams?.status === 'string' ? searchParams.status : 'all'}
            initialCategory={typeof searchParams?.category === 'string' ? searchParams.category : 'all'}
            initialQuery={typeof searchParams?.q === 'string' ? searchParams.q : ''}
        />
    );
}
