'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { resolveAdminTab } from './admin-tabs';

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const searchParams = useSearchParams();
    const selectedTab = resolveAdminTab(searchParams.get('tab'));

    return (
        <div className="min-h-screen bg-muted/30">
            <AdminHeader selectedTab={selectedTab} />
            <div className="flex flex-col md:flex-row gap-6 p-6 container max-w-[1600px] mx-auto">
                <AdminSidebar selectedTab={selectedTab} />
                <main className="flex-1 min-w-0">
                    <div className="bg-background rounded-2xl border shadow-sm p-6 min-h-[calc(100vh-160px)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
