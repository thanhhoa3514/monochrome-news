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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
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

  const handleFileChange = (file: File | null) => {
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview("");
    }
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
      if (initialData) {
        // Update existing news
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('slug', generateSlug(formData.title)); // Regenerate slug or keep existing? Usually keep existing or allow edit. For now regenerate to match title.
        formDataToSend.append('content', formData.content);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('user_id', user.id.toString());
        formDataToSend.append('is_premium', formData.is_premium ? '1' : '0');

        if (thumbnailFile) {
          formDataToSend.append('thumbnail', thumbnailFile);
        }

        await newsService.updateNews(initialData.id, formDataToSend);
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        // Create new news with FormData
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('slug', generateSlug(formData.title) + '-' + Date.now());
        formDataToSend.append('content', formData.content);
        formDataToSend.append('category_id', formData.category_id);
        formDataToSend.append('user_id', user.id.toString());
        formDataToSend.append('is_premium', formData.is_premium ? '1' : '0');
        formDataToSend.append('published_at', new Date().toISOString());

        if (thumbnailFile) {
          formDataToSend.append('thumbnail', thumbnailFile);
        }

        await newsService.createNews(formDataToSend);
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      if (onSuccess) {
        onSuccess();
      }
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
          <Label htmlFor="thumbnailFile">Thumbnail Image</Label>
          <Input
            id="thumbnailFile"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
          {thumbnailPreview && (
            <div className="mt-2">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-32 w-auto object-cover rounded border"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Upload an image file (max 5MB) or leave empty to use AI-generated thumbnail
          </p>
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
