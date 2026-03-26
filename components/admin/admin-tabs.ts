export const ADMIN_TABS = [
    'dashboard',
    'articles',
    'users',
    'subscriptions',
    'permissions',
    'ai-articles',
    'tags',
] as const;

export type AdminTab = typeof ADMIN_TABS[number];

export const ADMIN_TAB_LABELS: Record<AdminTab, string> = {
    dashboard: 'Dashboard',
    articles: 'Articles',
    users: 'Users',
    subscriptions: 'Subscriptions',
    permissions: 'Permissions',
    'ai-articles': 'AI News Generator',
    tags: 'Tags',
};

export function resolveAdminTab(input?: string | null): AdminTab {
    if (input && ADMIN_TABS.includes(input as AdminTab)) {
        return input as AdminTab;
    }

    return 'dashboard';
}
