import React, { useState, useEffect } from 'react';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tag';
import { tagService } from '@/services/tagService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddEditTagModal from '@/components/modals/AddEditTagModal';
import DeleteModal from '@/components/modals/DeleteModal';
import { useDebounce } from '@/hooks/use-debounce';

const AdminTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const { toast } = useToast();

    // Modal states
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | undefined>(undefined);

    useEffect(() => {
        fetchTags();
    }, [debouncedSearch]);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await tagService.getTags({
                q: debouncedSearch,
                per_page: 50 // Fetch more for admin view
            });

            if (Array.isArray(response)) {
                setTags(response);
            } else {
                setTags(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            toast({
                title: "Error",
                description: "Failed to load tags",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = () => {
        setSelectedTag(undefined);
        setIsAddEditModalOpen(true);
    };

    const handleEditTag = (tag: Tag) => {
        setSelectedTag(tag);
        setIsAddEditModalOpen(true);
    };

    const handleDeleteClick = (tag: Tag) => {
        setSelectedTag(tag);
        setIsDeleteModalOpen(true);
    };

    const handleSaveTag = async (data: CreateTagInput | UpdateTagInput) => {
        try {
            if (selectedTag) {
                await tagService.updateTag(selectedTag.id, data);
                toast({ title: "Success", description: "Tag updated successfully" });
            } else {
                await tagService.createTag(data as CreateTagInput);
                toast({ title: "Success", description: "Tag created successfully" });
            }
            setIsAddEditModalOpen(false);
            fetchTags();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save tag",
                variant: "destructive"
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTag) return;

        try {
            await tagService.deleteTag(selectedTag.id);
            toast({ title: "Success", description: "Tag deleted successfully" });
            setIsDeleteModalOpen(false);
            fetchTags();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete tag",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-serif">Tag Management</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 w-full"
                        />
                    </div>
                    <Button onClick={handleAddTag} className="shrink-0 bg-primary text-primary-foreground">
                        <Plus className="h-4 w-4 mr-1" /> New Tag
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Articles</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No tags found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell className="font-medium">
                                            {tag.name}
                                            {tag.description && (
                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                    {tag.description}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            {tag.slug}
                                        </TableCell>
                                        <TableCell>
                                            {tag.color ? (
                                                <Badge style={{ backgroundColor: tag.color }} className="text-white border-0">
                                                    {tag.color}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {tag.news_count || 0}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditTag(tag)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClick(tag)}>
                                                    <Trash2 className="h-4 w-4" />
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

            <AddEditTagModal
                isOpen={isAddEditModalOpen}
                onClose={() => setIsAddEditModalOpen(false)}
                onSave={handleSaveTag}
                tag={selectedTag}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Tag"
                description={`Are you sure you want to delete the tag "${selectedTag?.name}"? This will remove it from all associated articles.`}
            />
        </div>
    );
};

export default AdminTags;
