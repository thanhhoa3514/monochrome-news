import React from 'react';
import CategoryListClient from './CategoryListClient';
import { serverNewsService } from '@/lib/server';
import { Category } from '@/types/news';

export default async function CategoryList() {
  let categories: Category[] = [];

  try {
    categories = await serverNewsService.getCategories();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }

  return <CategoryListClient initialCategories={categories || []} />;
}
