import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tag, CreateTagInput, UpdateTagInput } from '@/types/tag';

interface AddEditTagModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateTagInput | UpdateTagInput) => Promise<void>;
    tag?: Tag;
}

const AddEditTagModal: React.FC<AddEditTagModalProps> = ({ isOpen, onClose, onSave, tag }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#000000');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tag) {
            setName(tag.name);
            setSlug(tag.slug);
            setDescription(tag.description || '');
            setColor(tag.color || '#000000');
        } else {
            setName('');
            setSlug('');
            setDescription('');
            setColor('#000000');
        }
    }, [tag, isOpen]);

    // Auto-generate slug from name if slug is empty
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        if (!tag && !slug) {
            setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                name,
                slug: slug || undefined,
                description: description || undefined,
                color: color || undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tag ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="e.g. Technology"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. technology"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="color">Badge Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="color"
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-12 p-1 h-10"
                            />
                            <Input
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="#000000"
                                className="flex-1"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (SEO)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter tag description for SEO..."
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Tag'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEditTagModal;
