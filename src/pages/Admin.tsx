import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  Search,
  UserRound,
  UserRoundPlus,
  Filter,
  Shield,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockNewsData } from '@/data/mockNewsData';
import { mockUserData, User } from '@/data/mockUserData';
import { mockSubscriptionData, Subscription } from '@/data/mockSubscriptionData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ThemeToggle from '@/components/ThemeToggle';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AdminPermissions from './AdminPermissions';
import AddEditArticleModal from '@/components/modals/AddEditArticleModal';

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'articles' | 'users' | 'subscriptions' | 'permissions' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionSearch, setSubscriptionSearch] = useState('');

  // User management state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [publishAsFeature, setPublishAsFeature] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // Article modal state
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);

  const filteredArticles = mockNewsData.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term and filters
  const filteredUsers = mockUserData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter subscriptions based on search term
  const filteredSubscriptions = mockSubscriptionData.filter(sub =>
    sub.userName.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
    sub.userEmail.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
    sub.planName.toLowerCase().includes(subscriptionSearch.toLowerCase())
  );

  const stats = {
    articles: mockNewsData.length,
    categories: [...new Set(mockNewsData.map(item => item.category))].length,
    users: mockUserData.length,
    views: 12580, // Mock data
    activeSubscriptions: mockSubscriptionData.filter(s => s.status === 'active').length,
    totalRevenue: mockSubscriptionData
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.amount, 0)
  };

  // User action handlers
  const handleEditUser = (userId: number) => {
    toast({
      title: "Edit User",
      description: `Edit user with ID: ${userId}`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "Delete User",
      description: `User with ID: ${userId} would be deleted`,
      variant: "destructive"
    });
  };

  const handleToggleUserStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    toast({
      title: "Status Changed",
      description: `${user.name}'s status changed to ${newStatus}`,
    });
  };

  const getRoleBadge = (role: 'admin' | 'editor' | 'viewer') => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary text-primary-foreground">{role}</Badge>;
      case 'editor':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{role}</Badge>;
      case 'viewer':
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: 'active' | 'inactive' | 'pending') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">{status}</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="border-destructive text-destructive">{status}</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">{status}</Badge>;
    }
  };

  const getSubscriptionStatusBadge = (status: 'active' | 'cancelled' | 'expired' | 'pending') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'cancelled':
        return <Badge className="bg-orange-600">Cancelled</Badge>;
      case 'expired':
        return <Badge variant="outline" className="border-destructive text-destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
    }
  };

  const getPlanTypeBadge = (planType: 'free' | 'basic' | 'premium' | 'enterprise') => {
    switch (planType) {
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      case 'basic':
        return <Badge className="bg-blue-600">Basic</Badge>;
      case 'premium':
        return <Badge className="bg-purple-600">Premium</Badge>;
      case 'enterprise':
        return <Badge className="bg-primary text-primary-foreground">Enterprise</Badge>;
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleAddArticle = (articleData: any) => {
    toast({
      title: "Article Added",
      description: `New article "${articleData.title}" has been created successfully.`,
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
            {selectedTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif">Dashboard Overview</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.articles}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.categories}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.users}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockNewsData.slice(0, 5).map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{article.category}</Badge>
                            </TableCell>
                            <TableCell>{article.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'articles' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold font-serif">Articles Management</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                    <Button
                      className="shrink-0 bg-primary text-primary-foreground"
                      onClick={() => setIsAddArticleModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> New Article
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredArticles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{article.category}</Badge>
                            </TableCell>
                            <TableCell>{article.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/news/${article.id}`)}>
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold font-serif">User Management</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-8 w-full"
                      />
                    </div>
                    <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="absolute mt-2 z-10 bg-card shadow-lg rounded-md p-4 border space-y-4 right-0">
                        <div className="space-y-2">
                          <Label htmlFor="role-filter">Role</Label>
                          <select
                            id="role-filter"
                            className="w-full border rounded p-2 bg-background"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                          >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status-filter">Status</Label>
                          <select
                            id="status-filter"
                            className="w-full border rounded p-2 bg-background"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <Button className="shrink-0 bg-primary text-primary-foreground">
                      <UserRoundPlus className="h-4 w-4 mr-1" /> Add User
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                    {user.avatar ? (
                                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <UserRound className="h-4 w-4" />
                                    )}
                                  </div>
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell>{user.lastLogin}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(user)}>
                                    {user.status === 'active' ? 'Disable' : 'Enable'}
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'subscriptions' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold font-serif">Subscriptions Management</h2>
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subscriptions..."
                      value={subscriptionSearch}
                      onChange={(e) => setSubscriptionSearch(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                </div>

                {/* Subscription Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockSubscriptionData.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {mockSubscriptionData.filter(s => s.status === 'active').length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cancelled/Expired</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {mockSubscriptionData.filter(s => s.status === 'cancelled' || s.status === 'expired').length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${mockSubscriptionData.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Renewal</TableHead>
                            <TableHead>Auto-Renew</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubscriptions.map((subscription) => (
                            <TableRow key={subscription.id}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{subscription.userName}</span>
                                  <span className="text-xs text-muted-foreground">{subscription.userEmail}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{subscription.planName}</TableCell>
                              <TableCell>{getPlanTypeBadge(subscription.planType)}</TableCell>
                              <TableCell>{getSubscriptionStatusBadge(subscription.status)}</TableCell>
                              <TableCell>
                                <span className="font-medium">
                                  {subscription.currency} ${subscription.amount.toFixed(2)}
                                </span>
                              </TableCell>
                              <TableCell>{subscription.startDate}</TableCell>
                              <TableCell>{subscription.renewalDate}</TableCell>
                              <TableCell>
                                {subscription.autoRenew ? (
                                  <Badge className="bg-green-600">Yes</Badge>
                                ) : (
                                  <Badge variant="outline">No</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={subscription.status === 'active' ? 'text-destructive hover:bg-destructive/10' : ''}
                                  >
                                    {subscription.status === 'active' ? 'Cancel' : 'Reactivate'}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'permissions' && (
              <AdminPermissions />
            )}

            {selectedTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif">Settings</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications when new articles are published
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="publish-feature">Publish as Feature</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically mark new articles as featured
                          </p>
                        </div>
                        <Switch
                          id="publish-feature"
                          checked={publishAsFeature}
                          onCheckedChange={setPublishAsFeature}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-save">Auto-save Drafts</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically save article drafts every 5 minutes
                          </p>
                        </div>
                        <Switch
                          id="auto-save"
                          checked={autoSave}
                          onCheckedChange={setAutoSave}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">Site Appearance</h3>
                      <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <span className="text-sm">Toggle between light and dark mode</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3">User Permissions</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Control who has access to the admin dashboard and what they can do
                      </p>
                      <Button variant="outline" size="sm">
                        Manage Permissions
                      </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button className="bg-actionRed hover:bg-actionRed-hover">
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
};

export default Admin;
