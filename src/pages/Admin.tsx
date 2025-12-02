import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminArticles from '@/components/admin/AdminArticles';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import AdminPermissions from '@/components/admin/AdminPermissions';
import AdminAIArticles from '@/components/admin/AdminAIArticles';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminTags from '@/components/admin/AdminTags';
import AdminProfile from '@/components/admin/AdminProfile';

type TabType = 'dashboard' | 'articles' | 'users' | 'subscriptions' | 'permissions' | 'settings' | 'ai-articles' | 'tags' | 'profile';

const validTabs: TabType[] = ['dashboard', 'articles', 'users', 'subscriptions', 'permissions', 'settings', 'ai-articles', 'tags', 'profile'];

const Admin = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);

  // Validate tab from URL, default to 'dashboard'
  const selectedTab: TabType = validTabs.includes(tab as TabType) ? (tab as TabType) : 'dashboard';

  const setSelectedTab = (newTab: TabType) => {
    navigate(`/admin/${newTab}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <AdminHeader selectedTab={selectedTab} />

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
            {selectedTab === 'tags' && <AdminTags />}
            {selectedTab === 'settings' && <AdminSettings />}
            {selectedTab === 'profile' && <AdminProfile />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Admin;
