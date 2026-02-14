import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import EditorDashboard from '@/components/editor/EditorDashboard';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminAIArticles from '@/components/admin/AdminAIArticles';
import AdminTags from '@/components/admin/AdminTags';
import AddEditArticleModal from '@/components/modals/AddEditArticleModal';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { FileText, Sparkles, LayoutDashboard, Tag } from 'lucide-react';


type TabType = 'dashboard' | 'articles' | 'ai-articles' | 'tags';

const validTabs: TabType[] = ['dashboard', 'articles', 'ai-articles', 'tags'];


const Editor = () => {
    const { toast } = useToast();
    const { tab } = useParams<{ tab?: string }>();
    const navigate = useNavigate();
    const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);

    // Determine selected tab from URL or default to 'dashboard'
    const selectedTab: TabType = validTabs.includes(tab as TabType) ? (tab as TabType) : 'dashboard';

    const handleTabChange = (newTab: TabType) => {
        navigate(`/editor/${newTab}`);
    };

    const tabs = [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'articles' as TabType, label: 'My Articles', icon: FileText },
        { id: 'tags' as TabType, label: 'Tags', icon: Tag },
        { id: 'ai-articles' as TabType, label: 'AI Generator', icon: Sparkles },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <AdminHeader selectedTab={selectedTab} />

            <div className="container px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="md:w-64 shrink-0">
                        <Card className="p-4">
                            <div className="space-y-2">
                                {tabs.map((tabItem) => {
                                    const Icon = tabItem.icon;
                                    return (
                                        <button
                                            key={tabItem.id}
                                            onClick={() => handleTabChange(tabItem.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${selectedTab === tabItem.id
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'hover:bg-muted'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-medium">{tabItem.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {selectedTab === 'dashboard' && <EditorDashboard onNavigate={handleTabChange} />}
                        {selectedTab === 'articles' && <AdminArticles onAddArticle={() => setIsAddArticleModalOpen(true)} />}
                        {selectedTab === 'tags' && <AdminTags />}
                        {selectedTab === 'ai-articles' && <AdminAIArticles />}
                    </main>
                </div>
            </div>


        </div>
    );
};

export default Editor;
