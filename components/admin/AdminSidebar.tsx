import React from 'react';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Shield,
    CreditCard,
    Sparkles,
    Tag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TabType = 'dashboard' | 'articles' | 'users' | 'subscriptions' | 'permissions' | 'settings' | 'ai-articles' | 'tags' | 'profile';

interface AdminSidebarProps {
    selectedTab: TabType;
    setSelectedTab: (tab: TabType) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ selectedTab, setSelectedTab }) => {
    return (
        <aside className="w-full md:w-64 shrink-0 space-y-2">
            <Card>
                <CardContent className="p-0">
                    <nav className="flex flex-col">
                        <Button
                            variant={selectedTab === 'dashboard' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('dashboard')}
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Button>
                        <Button
                            variant={selectedTab === 'articles' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('articles')}
                        >
                            <FileText size={18} />
                            Articles
                        </Button>
                        <Button
                            variant={selectedTab === 'users' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('users')}
                        >
                            <Users size={18} />
                            Users
                        </Button>
                        <Button
                            variant={selectedTab === 'subscriptions' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('subscriptions')}
                        >
                            <CreditCard size={18} />
                            Subscriptions
                        </Button>
                        <Button
                            variant={selectedTab === 'permissions' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('permissions')}
                        >
                            <Shield size={18} />
                            Permissions
                        </Button>
                        <Button
                            variant={selectedTab === 'ai-articles' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('ai-articles')}
                        >
                            <Sparkles size={18} />
                            AI Articles
                        </Button>
                        <Button
                            variant={selectedTab === 'tags' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('tags')}
                        >
                            <Tag size={18} />
                            Tags
                        </Button>
                        <Button
                            variant={selectedTab === 'settings' ? 'default' : 'ghost'}
                            className="justify-start gap-2 rounded-none"
                            onClick={() => setSelectedTab('settings')}
                        >
                            <Settings size={18} />
                            Settings
                        </Button>
                    </nav>
                </CardContent>
            </Card>
        </aside>
    );
};

export default AdminSidebar;
