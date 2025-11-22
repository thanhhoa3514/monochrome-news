import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminPermissions from '@/components/admin/AdminPermissions';
import AdminAIArticles from '@/components/admin/AdminAIArticles';
import AdminSettings from '@/components/admin/AdminSettings';


import AddEditArticleModal from '@/components/modals/AddEditArticleModal';
import { useToast } from '@/hooks/use-toast';
type TabType = 'dashboard' | 'articles' | 'users' | 'subscriptions' | 'permissions' | 'settings' | 'ai-articles';



const Admin = () => {
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
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <AdminHeader />

      <div className="container px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {/* Main Content */}
          <main className="flex-1">
            {selectedTab === 'dashboard' && <AdminDashboard />}
            {selectedTab === 'articles' && <AdminArticles onAddArticle={() => setIsAddArticleModalOpen(true)} />}
            {selectedTab === 'users' && <AdminUsers />}
            {selectedTab === 'subscriptions' && <AdminSubscriptions />}
            {selectedTab === 'permissions' && <AdminPermissions />}
            {selectedTab === 'ai-articles' && <AdminAIArticles />}
            {selectedTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AddEditArticleModal
        isOpen={isAddArticleModalOpen}
        onClose={() => setIsAddArticleModalOpen(false)}
        onSubmit={handleAddArticle}
      />
    </div>
  );
}

export default Admin;
