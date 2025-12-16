import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Eye, CheckCircle, FileEdit } from 'lucide-react';

interface EditorDashboardProps {
    onNavigate?: (tab: string) => void;
}

const EditorDashboard = ({ onNavigate }: EditorDashboardProps) => {
    // Editor-specific stats (limited compared to Admin)
    const stats = {
        myArticles: 24, // Mock: articles created by this editor
        totalViews: 8450, // Mock: total views on editor's articles
        published: 18, // Mock: published articles
        drafts: 6, // Mock: draft articles
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-serif">Editor Dashboard</h2>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your content.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            My Articles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.myArticles}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total articles created</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-500" />
                            Total Views
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all your articles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Published
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.published}</div>
                        <p className="text-xs text-muted-foreground mt-1">Live articles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <FileEdit className="w-4 h-4 text-yellow-500" />
                            Drafts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.drafts}</div>
                        <p className="text-xs text-muted-foreground mt-1">Work in progress</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => onNavigate?.('articles')}
                        >
                            <h3 className="font-semibold mb-2">📝 Create New Article</h3>
                            <p className="text-sm text-muted-foreground">Start writing a new article from scratch</p>
                        </div>
                        <div
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => onNavigate?.('ai-articles')}
                        >
                            <h3 className="font-semibold mb-2">✨ AI Generator</h3>
                            <p className="text-sm text-muted-foreground">Generate content using AI assistance</p>
                        </div>
                        <div
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => onNavigate?.('tags')}
                        >
                            <h3 className="font-semibold mb-2">🏷️ Manage Tags</h3>
                            <p className="text-sm text-muted-foreground">Create and organize content tags</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Your recently edited articles and activity will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditorDashboard;
