import React from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    FileText,
    Users,
    Shield,
    CreditCard,
    Sparkles,
    Tag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminTab } from './admin-tabs';

interface AdminSidebarProps {
    selectedTab: AdminTab;
}

const navItems: Array<{
    tab: AdminTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'articles', label: 'Articles', icon: FileText },
    { tab: 'users', label: 'Users', icon: Users },
    { tab: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { tab: 'permissions', label: 'Permissions', icon: Shield },
    { tab: 'ai-articles', label: 'AI Articles', icon: Sparkles },
    { tab: 'tags', label: 'Tags', icon: Tag },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ selectedTab }) => {
    return (
        <aside className="w-full md:w-64 shrink-0 space-y-2">
            <Card>
                <CardContent className="p-0">
                    <nav className="flex flex-col">
                        {navItems.map((item) => (
                            <Button
                                key={item.tab}
                                asChild
                                variant={selectedTab === item.tab ? 'default' : 'ghost'}
                                className="justify-start gap-2 rounded-none"
                            >
                                <Link href={item.tab === 'dashboard' ? '/admin' : `/admin?tab=${item.tab}`}>
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </CardContent>
            </Card>
        </aside>
    );
};

export default AdminSidebar;
