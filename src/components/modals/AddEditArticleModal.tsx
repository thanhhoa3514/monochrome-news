
import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { mockNewsData } from "@/data/mockNewsData";

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  date: string;
  author: string;
  image: string;
}

interface AddEditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (article: Partial<Article>) => void;
  initialData?: Article;
}

const AddEditArticleModal = ({ isOpen, onClose, onSubmit, initialData }: AddEditArticleModalProps) => {
  const initialFormState = {
    title: "",
    content: "",
    summary: "",
    category: "News",
    author: "",
    image: "",
  };

  const [formData, setFormData] = useState<Partial<Article>>(initialFormState);

  // Get unique categories from mock data
  const categories = Array.from(new Set(mockNewsData.map(news => news.category)));

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        summary: initialData.summary,
        category: initialData.category,
        author: initialData.author,
        image: initialData.image,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Article, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
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
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Enter summary"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Enter article content"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder="Enter author name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>
    </FormModal>
  );
};

export default AddEditArticleModal;
