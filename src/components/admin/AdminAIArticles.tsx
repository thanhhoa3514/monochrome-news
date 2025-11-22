import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const AdminAIArticles = () => {
    const [aiCategory, setAiCategory] = useState('politics');
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiArticleCount, setAiArticleCount] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif">AI Article Generator</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Generate Articles with AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={aiCategory}
                                onChange={(e) => setAiCategory(e.target.value)}
                            >
                                <option value="politics">Chính trị</option>
                                <option value="economy">Kinh tế</option>
                                <option value="tech">Công nghệ</option>
                                <option value="sports">Thể thao</option>
                                <option value="culture">Văn hóa</option>
                                <option value="science">Khoa học</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Number of Articles</Label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={aiArticleCount}
                                onChange={(e) => setAiArticleCount(Number(e.target.value))}
                            >
                                <option value={1}>1 Article</option>
                                <option value={3}>3 Articles</option>
                                <option value={5}>5 Articles</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Custom Prompt (Optional)</Label>
                        <textarea
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            placeholder={`Hãy đóng vai một nhà báo chuyên nghiệp. Viết cho tôi ${aiArticleCount} bài báo mới nhất về chủ đề '${aiCategory}'. Nội dung phải dài, chi tiết, có thẻ HTML (p, h2, ul). Trả về kết quả dưới dạng JSON thuần (raw json array), không markdown, với các trường: title, content (html), summary (để làm sapo), image_keyword (từ khóa tiếng anh để tìm ảnh).`}
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-actionRed hover:bg-actionRed-hover"
                        disabled={isGenerating}
                        onClick={() => {
                            setIsGenerating(true);
                            // Simulate API call - backend will be implemented later
                            setTimeout(() => {
                                setGeneratedArticles([
                                    {
                                        title: "Sample Article 1 - " + aiCategory,
                                        summary: "This is a sample summary for the first article.",
                                        content: "<p>This is the full content with <strong>HTML</strong> formatting.</p><h2>Key Points</h2><ul><li>Point 1</li><li>Point 2</li></ul>",
                                        image_keyword: "news technology"
                                    },
                                    {
                                        title: "Sample Article 2 - " + aiCategory,
                                        summary: "This is a sample summary for the second article.",
                                        content: "<p>Another article with detailed content and <strong>formatting</strong>.</p>",
                                        image_keyword: "breaking news"
                                    }
                                ]);
                                setIsGenerating(false);
                            }, 2000);
                        }}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Articles'}
                    </Button>
                </CardContent>
            </Card>

            {generatedArticles.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Generated Articles</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {generatedArticles.map((article, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle>{article.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-medium">Summary (Sapo)</Label>
                                        <p className="text-muted-foreground mt-1">{article.summary}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Content (HTML)</Label>
                                        <div className="bg-muted p-3 rounded-md mt-1 max-h-[200px] overflow-y-auto">
                                            <code className="text-xs">{article.content}</code>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">Image Keyword</Label>
                                        <p className="text-muted-foreground mt-1">{article.image_keyword}</p>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(JSON.stringify(article, null, 2));
                                                toast({
                                                    title: "Copied!",
                                                    description: "Article JSON copied to clipboard"
                                                });
                                            }}
                                        >
                                            Copy JSON
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(article.content);
                                                toast({
                                                    title: "Copied!",
                                                    description: "HTML content copied"
                                                });
                                            }}
                                        >
                                            Copy HTML
                                        </Button>
                                        <Button size="sm" className="bg-actionRed hover:bg-actionRed-hover">
                                            Save to Articles
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAIArticles;
