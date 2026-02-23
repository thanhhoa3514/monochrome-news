"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tag';
import { createTagAction, updateTagAction, deleteTagAction } from '@/actions/tags';
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

interface AdminTagsClientProps {
    initialTags: Tag[];
}

const AdminTagsClient = ({ initialTags }: AdminTagsClientProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [tags, setTags] = useState<Tag[]>(initialTags);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    // Modal states
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | undefined>(undefined);
    const [isFirstRender, setIsFirstRender] = useState(true);

    // Filter tags client-side based on search
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        startTransition(async () => {
            let result;
            if (selectedTag) {
                result = await updateTagAction(selectedTag.id, data);
            } else {
                result = await createTagAction(data as CreateTagInput);
            }

            if (result.success) {
                toast({ title: "Success", description: selectedTag ? "Tag updated successfully" : "Tag created successfully" });
                setIsAddEditModalOpen(false);
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to save tag",
                    variant: "destructive"
                });
            }
        });
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTag) return;

        startTransition(async () => {
            const result = await deleteTagAction(selectedTag.id);
            if (result.success) {
                toast({ title: "Success", description: "Tag deleted successfully" });
                setIsDeleteModalOpen(false);
                router.refresh();
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to delete tag",
                    variant: "destructive"
                });
            }
        });
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
                            {loading && tags.length === 0 ? (
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

export default AdminTagsClient;
