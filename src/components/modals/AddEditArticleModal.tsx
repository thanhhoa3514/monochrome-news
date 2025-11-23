import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { newsService } from "@/services/newsService";
import { useAuth } from "@/contexts/AuthContext";
import { News, Category } from "@/types/news";
import { CreateNewsInput } from "@/types/news";
import { toast } from "@/hooks/use-toast";

type AddEditArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: News;
}

type FormData = {
  title: string;
  content: string;
  category_id: string;
  is_premium: boolean;
  thumbnail?: string;
}

const AddEditArticleModal = ({ isOpen, onClose, onSuccess, initialData }: AddEditArticleModalProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    category_id: "",
    is_premium: false,
    thumbnail: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await newsService.getCategories();
        setCategories(cats);
        if (cats.length > 0 && !formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id.toString() }));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      }
    };
    fetchCategories();
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        category_id: initialData.category_id.toString(),
        is_premium: initialData.is_premium,
        thumbnail: initialData.thumbnail || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        category_id: categories.length > 0 ? categories[0].id.toString() : "",
        is_premium: false,
        thumbnail: "",
      });
    }
  }, [initialData, isOpen, categories]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newsInput: CreateNewsInput = {
        title: formData.title,
        slug: initialData?.slug || generateSlug(formData.title) + '-' + Date.now(),
        content: formData.content,
        category_id: Number(formData.category_id),
        user_id: user.id,
        is_premium: formData.is_premium,
        published_at: new Date().toISOString(),
        thumbnail: formData.thumbnail || undefined,
      };

      if (initialData) {
        // Update existing news
        // Note: You'll need to add updateNews method to newsService
        toast({
          title: "Info",
          description: "Update functionality coming soon",
        });
      } else {
        // Create new news
        await newsService.createNews(newsInput);
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save article:', error);
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? "Edit Article" : "Add New Article"}
      description={isEditing ? "Update article information" : "Create a new article"}
      submitText={isEditing ? "Update" : "Create"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Enter article content"
            rows={8}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => handleChange("category_id", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            value={formData.thumbnail}
            onChange={(e) => handleChange("thumbnail", e.target.value)}
            placeholder="Enter image URL"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_premium"
            checked={formData.is_premium}
            onChange={(e) => handleChange("is_premium", e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="is_premium" className="cursor-pointer">Premium Article</Label>
        </div>
      </div>
    </FormModal>
  );
};

export default AddEditArticleModal;
