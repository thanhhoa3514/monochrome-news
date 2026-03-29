import AdminAIArticles from '@/components/admin/AdminAIArticles';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminPermissions from '@/components/admin/AdminPermissions';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminTags from '@/components/admin/AdminTags';
import AdminUsers from '@/components/admin/AdminUsers';
import { resolveAdminTab } from '@/components/admin/admin-tabs';

interface AdminPageProps {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
    const tabValue = typeof searchParams?.tab === 'string' ? searchParams.tab : null;
    const selectedTab = resolveAdminTab(tabValue);

    switch (selectedTab) {
        case 'articles':
            return <AdminArticles searchParams={searchParams ?? {}} />;
        case 'users':
            return <AdminUsers searchParams={searchParams ?? {}} />;
        case 'subscriptions':
            return <AdminSubscriptions searchParams={searchParams ?? {}} />;
        case 'permissions':
            return <AdminPermissions />;
        case 'ai-articles':
            return <AdminAIArticles />;
        case 'tags':
            return <AdminTags searchParams={searchParams ?? {}} />;
        case 'dashboard':
        default:
            return <AdminDashboard />;
    }
}
