import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { serverNewsService } from '@/lib/server';
import { serverUserService } from '@/lib/server';

export default async function AdminDashboard() {
    let stats = {
        articles: 0,
        categories: 0,
        users: 0,
        views: 0,
        activeSubscriptions: 0,
        totalRevenue: 0
    };

    try {
        const [newsData, categoriesData, usersData] = await Promise.all([
            serverNewsService.getNews({ per_page: 1 }),
            serverNewsService.getCategories(),
            serverUserService.getUsers(1, 1)
        ]);

        stats = {
            articles: newsData.total,
            categories: categoriesData.length,
            users: usersData.total,
            views: 0, // Placeholder
            activeSubscriptions: 0, // Placeholder
            totalRevenue: 0 // Placeholder
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif">Dashboard Overview</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.articles}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.categories}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Recent articles, user signups, and subscription changes will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
