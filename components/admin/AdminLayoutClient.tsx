'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

type TabType = 'dashboard' | 'articles' | 'users' | 'subscriptions' | 'permissions' | 'settings' | 'ai-articles' | 'tags' | 'profile';

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedTab, setSelectedTab] = useState<TabType>('dashboard');

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminHeader selectedTab={selectedTab} />
            <div className="flex flex-col md:flex-row gap-6 p-6 container max-w-[1600px] mx-auto">
                <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <main className="flex-1 min-w-0">
                    <div className="bg-background rounded-2xl border shadow-sm p-6 min-h-[calc(100vh-160px)]">
                        {/* In a real app, 'children' would be different pages. 
                            Since the components use selectedTab state, we might eventually
                            refactor this to use URL-based routing. For now, we integrate as-is. */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
