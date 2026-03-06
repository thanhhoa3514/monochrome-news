/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Loader2, FileText, Filter, Calendar, User as UserIcon, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaginationControl from '@/components/common/PaginationControl';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useToast } from "@/hooks/use-toast";
import AdminArticleDetailModal from '@/components/modals/AdminArticleDetailModal';
import AddEditArticleModal from '@/components/modals/AddEditArticleModal';
import { News, Category } from '@/types/news';
import { deleteArticleAction } from '@/actions/articles';

interface AdminArticlesClientProps {
    initialArticles: News[];
    totalPages: number;
    currentPage: number;
    categories: Category[];
}

const AdminArticlesClient: React.FC<AdminArticlesClientProps> = ({
    initialArticles,
    totalPages,
    currentPage,
    categories,
}) => {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [articleToDelete, setArticleToDelete] = useState<any>(null);
    const [selectedArticle, setSelectedArticle] = useState<News | undefined>(undefined);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Edit/Add Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [articleToEdit, setArticleToEdit] = useState<News | undefined>(undefined);

    const handleViewArticle = (article: News) => {
        setSelectedArticle(article);
        setIsDetailModalOpen(true);
    };

    const handleEditArticle = (article: News) => {
        setArticleToEdit(article);
        setIsEditModalOpen(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (val: string) => {
        setStatusFilter(val);
    };

    const handleCategoryChange = (val: string) => {
        setCategoryFilter(val);
    };

    // Client-side filtering of the server-provided articles
    const articles = initialArticles.filter(article => {
        const matchesSearch = !searchTerm || article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || (() => {
            if (!article.published_at) return statusFilter === 'draft';
            const publishedDate = new Date(article.published_at);
            const now = new Date();
            if (publishedDate > now) return statusFilter === 'pending';
            return statusFilter === 'published';
        })();
        const matchesCategory = categoryFilter === 'all' || article.category_id?.toString() === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handleDelete = () => {
        if (!articleToDelete) return;
        startTransition(async () => {
            const result = await deleteArticleAction(articleToDelete.id);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Article deleted successfully",
                });
                setArticleToDelete(null);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete article",
                    variant: "destructive",
                });
            }
        });
    };

    const handlePageChange = (page: number) => {
        startTransition(() => {
            const url = new URL(window.location.href);
            if (page > 1) {
                url.searchParams.set('page', page.toString());
            } else {
                url.searchParams.delete('page');
            }
            router.push(url.pathname + url.search);
        });
    };

    const getStatusBadge = (article: any) => {
        if (!article.published_at) {
            return <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Draft</Badge>;
        }
        const publishedDate = new Date(article.published_at);
        const now = new Date();

        if (publishedDate > now) {
            return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">Pending</Badge>;
        }
        return <Badge className="bg-green-600 hover:bg-green-700">Published</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-serif">Articles Management</h2>
                    <p className="text-muted-foreground">Manage, publish, and track your news content.</p>
                </div>

                <Button
                    onClick={() => { setArticleToEdit(undefined); setIsEditModalOpen(true); }}
                    className="bg-primary text-primary-foreground shrink-0"
                >
                    <Plus className="h-4 w-4 mr-1" /> New Article
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg border">
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto flex-1">
                    <div className="relative flex-1 sm:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search title..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-8 bg-background"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full sm:w-[150px] bg-background">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-background">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead className="w-[400px]">Title & Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center ">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Loading articles...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : articles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                                            <p>No articles found matching your filters.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                articles.map((article) => (
                                    <TableRow key={article.id} className='cursor-pointer hover:bg-muted/50'>
                                        <TableCell>
                                            {article.thumbnail ? (
                                                <img
                                                    src={article.thumbnail}
                                                    alt=""
                                                    className="w-10 h-10 rounded object-cover bg-muted"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=News';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium line-clamp-1" title={article.title}>
                                                    {article.title}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <UserIcon className="w-3 h-3" />
                                                    <span>By: {article.user?.name || 'Unknown'}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {article.category?.name || 'Uncategorized'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(article)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="text-muted-foreground text-xs">
                                                    {article.published_at ? 'Published:' : 'Created:'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-muted-foreground" />
                                                    {new Date(article.published_at || article.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewArticle(article)}>
                                                    View
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditArticle(article)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setArticleToDelete(article)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {articles.length > 0 && (
                <div className="text-center text-xs text-muted-foreground">
                    Showing {articles.length} results (Page {currentPage} of {totalPages})
                </div>
            )}

            <ConfirmDialog
                isOpen={!!articleToDelete}
                onClose={() => setArticleToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Article"
                description={
                    <>
                        Are you sure you want to delete the article <strong>{articleToDelete?.title}</strong>?
                        <br /><br />
                        This action cannot be undone.
                    </>
                }
                confirmText="Delete"
                variant="destructive"
            />

            <AdminArticleDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                article={selectedArticle}
            />

            <AddEditArticleModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setArticleToEdit(undefined);
                }}
                onSuccess={() => {
                    router.refresh();
                    setIsEditModalOpen(false);
                    setArticleToEdit(undefined);
                }}
                initialData={articleToEdit}
                categories={categories}
            />
        </div>
    );
};

export default AdminArticlesClient;
