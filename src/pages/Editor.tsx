import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import EditorDashboard from '@/components/editor/EditorDashboard';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminAIArticles from '@/components/admin/AdminAIArticles';
import AddEditArticleModal from '@/components/modals/AddEditArticleModal';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { FileText, Sparkles, LayoutDashboard } from 'lucide-react';

type TabType = 'dashboard' | 'articles' | 'ai-articles';

const Editor = () => {
    const { toast } = useToast();
    const [selectedTab, setSelectedTab] = useState<TabType>('dashboard');
    const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);

    const handleAddArticle = (articleData: any) => {
        toast({
            title: "Article Added",
            description: `New article "${articleData.title}" has been created successfully.`,
            variant: "default",
        });
    };

    const tabs = [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'articles' as TabType, label: 'My Articles', icon: FileText },
        { id: 'ai-articles' as TabType, label: 'AI Generator', icon: Sparkles },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <AdminHeader />

            <div className="container px-4 py-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="md:w-64 shrink-0">
                        <Card className="p-4">
                            <div className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSelectedTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all ${selectedTab === tab.id
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'hover:bg-muted'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {selectedTab === 'dashboard' && <EditorDashboard />}
                        {selectedTab === 'articles' && <AdminArticles onAddArticle={() => setIsAddArticleModalOpen(true)} />}
                        {selectedTab === 'ai-articles' && <AdminAIArticles />}
                    </main>
                </div>
            </div>

            {/* Modals */}
            <AddEditArticleModal
                isOpen={isAddArticleModalOpen}
                onClose={() => setIsAddArticleModalOpen(false)}
                onSuccess={() => {
                    setIsAddArticleModalOpen(false);
                    toast({
                        title: "Success",
                        description: "Article created successfully",
                    });
                }}
            />
        </div>
    );
};

export default Editor;
