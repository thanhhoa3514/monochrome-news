import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, Tag, Eye, Clock, Globe } from 'lucide-react';
import { News } from '@/types/news';

interface AdminArticleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    article?: News;
}

const AdminArticleDetailModal: React.FC<AdminArticleDetailModalProps> = ({ isOpen, onClose, article }) => {
    if (!article) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadge = (article: News) => {
        if (!article.published_at) {
            return <Badge variant="secondary" className="bg-gray-200 text-gray-700">Draft</Badge>;
        }
        const publishedDate = new Date(article.published_at);
        const now = new Date();

        if (publishedDate > now) {
            return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">Pending</Badge>;
        }
        return <Badge className="bg-green-600">Published</Badge>;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(article)}
                                <Badge variant="outline">{article.category?.name || 'Uncategorized'}</Badge>
                                {article.is_premium && <Badge className="bg-purple-600">Premium</Badge>}
                            </div>
                            <DialogTitle className="text-2xl font-serif leading-tight">{article.title}</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    <div className="space-y-6">
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-4">
                            <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                <span>{article.user?.name || 'Unknown Author'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>Published: {formatDate(article.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>Created: {formatDate(article.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>{article.views || 0} views</span>
                            </div>
                        </div>

                        {/* Thumbnail */}
                        {article.thumbnail && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                <img
                                    src={article.thumbnail}
                                    alt={article.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-zinc max-w-none dark:prose-invert">
                            <p className="whitespace-pre-wrap">{article.content}</p>
                        </div>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map(tag => (
                                        <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color ? `${tag.color}20` : undefined, color: tag.color }}>
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SEO / Slug Info */}
                        <div className="bg-muted/30 p-4 rounded-lg text-xs font-mono text-muted-foreground break-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Globe className="w-3 h-3" />
                                <span className="font-semibold">Slug:</span>
                            </div>
                            {article.slug}
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-2 border-t bg-muted/10">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdminArticleDetailModal;
