import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Terminal, Copy, FileText, Save, Trash2, Edit, CheckCircle2, Loader2, RefreshCw, History, Clock, ChevronRight } from 'lucide-react';
import AddEditArticleModal from '@/components/modals/AddEditArticleModal';
import { newsService } from '@/services/newsService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types/news';


const AdminAIArticles = () => {
    const { user } = useAuth();
    // Configuration State
    const [categories, setCategories] = useState<Category[]>([]);
    const [aiCategoryId, setAiCategoryId] = useState<string>('');
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiArticleCount, setAiArticleCount] = useState(3);
    const [language, setLanguage] = useState('vietnamese');
    const [tone, setTone] = useState('neutral');
    const [length, setLength] = useState('medium');
    const [includeImage, setIncludeImage] = useState(true);

    // Execution State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
    const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // History State
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);

    // Fetch History & Categories
    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/ai-generations', {
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json();
            setHistory(data.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await newsService.getCategories();
            setCategories(data);
            if (data.length > 0) {
                setAiCategoryId(data[0].id.toString());
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchCategories();
    }, []);

    // Terminal Log Animation
    const addLog = (message: string) => {
        setLogs(prev => [...prev, `> ${message}`]);
    };

    const handleGenerate = async () => {
        if (!aiCategoryId) {
            toast({ title: "Error", description: "Please select a category", variant: "destructive" });
            return;
        }

        const selectedCategory = categories.find(c => c.id.toString() === aiCategoryId);
        const categoryName = selectedCategory ? selectedCategory.name : 'General';

        setIsGenerating(true);
        setGeneratedArticles([]);
        setCurrentGenerationId(null);
        setLogs([]);

        // Simulate AI Process with Terminal Logs (Visual feedback only)
        addLog(`Connecting to Gemini AI...`);
        setTimeout(() => addLog(`Authenticating secure session...`), 800);
        setTimeout(() => addLog(`Sending request to backend...`), 1500);

        try {
            // Call API
            const response = await newsService.generateAiNews({
                category: categoryName,
                count: aiArticleCount,
                language: language,
                tone: tone,
                length: length,
                prompt: aiPrompt
            });

            // Simulate processing logs while "waiting" (or just show them fast)
            addLog(`Received response from server.`);
            // addLog(`Formatting ${response.length} articles...`);

            // Check if response has generation_id (new flow) or is just array (old flow fallback)
            let articles = [];
            if (Array.isArray(response)) {
                articles = response;
            } else if (response.data) {
                articles = response.data;
                setCurrentGenerationId(response.generation_id || null);
            }

            setGeneratedArticles(articles);
            addLog(`Success! Generated ${articles.length} articles.`);
            toast({
                title: "Generation Complete",
                description: `Successfully generated ${articles.length} articles.`,
            });
            fetchHistory(); // Refresh history
        } catch (error) {
            console.error(error);
            addLog(`Error: Failed to generate articles.`);
            toast({
                title: "Generation Failed",
                description: "Could not generate articles. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = async (article: any) => {
        if (!user) {
            toast({ title: "Error", description: "You must be logged in to publish.", variant: "destructive" });
            return;
        }

        try {
            // 1. Create News
            await newsService.createNews({
                title: article.title,
                slug: article.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
                content: article.content,
                category_id: Number(aiCategoryId),
                user_id: user.id,
                is_premium: false,
                published_at: new Date().toISOString()
            });

            // 2. Mark as Saved if we have a generation ID
            if (currentGenerationId) {
                await fetch(`http://localhost:8000/api/v1/ai-generations/${currentGenerationId}/save`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include'
                });
                fetchHistory(); // Refresh status in history
            }

            toast({
                title: "Article Published",
                description: `"${article.title}" has been saved to the database.`,
            });
        } catch (error) {
            console.error('Publish failed:', error);
            toast({
                title: "Publish Failed",
                description: "Could not save article.",
                variant: "destructive"
            });
        }
    };

    const loadFromHistory = (item: any) => {
        setGeneratedArticles(item.generated_content);
        setCurrentGenerationId(item.id);

        // Find category ID by name/slug if possible, or just keep current
        const category = categories.find(c => c.name === item.category || c.slug === item.category);
        if (category) {
            setAiCategoryId(category.id.toString());
        }

        setAiPrompt(item.prompt || '');
        toast({
            title: "History Loaded",
            description: `Loaded generation from ${new Date(item.created_at).toLocaleDateString()}`,
        });
    };

    const handleDelete = (index: number) => {
        const newArticles = [...generatedArticles];
        newArticles.splice(index, 1);
        setGeneratedArticles(newArticles);
        toast({
            title: "Article Removed",
            description: "Removed from preview list.",
        });
    };

    const handleEdit = (article: any) => {
        setEditingArticle(article);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedArticle: any) => {
        const index = generatedArticles.findIndex(a => a.id === editingArticle.id);
        if (index !== -1) {
            const newArticles = [...generatedArticles];
            newArticles[index] = { ...newArticles[index], ...updatedArticle };
            setGeneratedArticles(newArticles);
            toast({
                title: "Changes Saved",
                description: "Article preview updated.",
            });
        }
        setIsEditModalOpen(false);
        setEditingArticle(null);
    };

    return (
        <div className="flex h-full gap-6">
            {/* HISTORY SIDEBAR */}
            <div className={`w-80 flex-shrink-0 border-r bg-muted/10 transition-all duration-300 ${isHistoryOpen ? 'ml-0' : '-ml-80 hidden'}`}>
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <History className="w-4 h-4" />
                        History
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="p-4 space-y-3">
                        {isLoadingHistory ? (
                            <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                        ) : history.map((item) => (
                            <div
                                key={item.id}
                                className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${currentGenerationId === item.id ? 'border-primary bg-primary/5' : 'border-transparent bg-card'}`}
                                onClick={() => loadFromHistory(item)}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.status === 'saved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-sm font-medium line-clamp-2 mb-1">{item.prompt || 'No custom prompt'}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 space-y-6 overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {!isHistoryOpen && (
                            <Button variant="outline" size="icon" onClick={() => setIsHistoryOpen(true)}>
                                <History className="w-4 h-4" />
                            </Button>
                        )}
                        <div>
                            <h2 className="text-3xl font-bold font-serif tracking-tight">AI News Generator</h2>
                            <p className="text-muted-foreground">Powered by Google Gemini AI</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                        <Sparkles className="w-3 h-3 mr-2 fill-primary" />
                        AI Model: Gemini 1.5 Flash
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: CONFIGURATION */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-muted/60 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <SettingsIcon className="w-5 h-5 text-primary" />
                                    Configuration
                                </CardTitle>
                                <CardDescription>Customize your generation parameters</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {/* Category & Count */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select value={aiCategoryId} onValueChange={setAiCategoryId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Count</Label>
                                        <Select value={aiArticleCount.toString()} onValueChange={(v) => setAiArticleCount(Number(v))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Article</SelectItem>
                                                <SelectItem value="3">3 Articles</SelectItem>
                                                <SelectItem value="5">5 Articles</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Language & Tone */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Select value={language} onValueChange={setLanguage}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vietnamese">Vietnamese</SelectItem>
                                                <SelectItem value="english">English</SelectItem>
                                                <SelectItem value="auto">Auto Detect</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tone</Label>
                                        <Select value={tone} onValueChange={setTone}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="neutral">Neutral</SelectItem>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="sarcastic">Sarcastic</SelectItem>
                                                <SelectItem value="clickbait">Clickbait</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Length */}
                                <div className="space-y-2">
                                    <Label>Length</Label>
                                    <Select value={length} onValueChange={setLength}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short">Short (&lt; 300 words)</SelectItem>
                                            <SelectItem value="medium">Medium (300 - 1000 words)</SelectItem>
                                            <SelectItem value="long">Long Form (&gt; 1000 words)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Include Image */}
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Include Images</Label>
                                        <p className="text-xs text-muted-foreground">Generate AI image keywords</p>
                                    </div>
                                    <Switch checked={includeImage} onCheckedChange={setIncludeImage} />
                                </div>

                                {/* Custom Prompt */}
                                <div className="space-y-2">
                                    <Label>Custom Prompt (Optional)</Label>
                                    <Textarea
                                        placeholder="Add specific instructions, focus points, or constraints..."
                                        className="min-h-[100px] resize-none"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                    />
                                </div>

                                {/* Generate Button */}
                                <Button
                                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/20 transition-all duration-300"
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Generate Articles
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: PREVIEW & TERMINAL */}
                    <div className="lg:col-span-8 space-y-6">
                        {isGenerating ? (
                            <Card className="bg-black border-zinc-800 shadow-2xl h-[600px] overflow-hidden flex flex-col">
                                <CardHeader className="bg-zinc-900/50 border-b border-zinc-800 py-3">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-mono text-zinc-400">AI_Process_Terminal.exe</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 font-mono text-sm md:text-base flex-1 overflow-y-auto space-y-2">
                                    {logs.map((log, index) => (
                                        <div key={index} className="text-green-500 animate-in fade-in slide-in-from-left-2 duration-300">
                                            {log}
                                        </div>
                                    ))}
                                    <div className="animate-pulse text-green-500">_</div>
                                </CardContent>
                            </Card>
                        ) : generatedArticles.length > 0 ? (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        Generated Results ({generatedArticles.length})
                                    </h3>
                                    <Button variant="outline" size="sm" onClick={() => setGeneratedArticles([])}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Clear All
                                    </Button>
                                </div>

                                <div className="grid gap-6">
                                    {generatedArticles.map((article, index) => (
                                        <Card key={index} className="group hover:shadow-md transition-all duration-300 border-muted/60">
                                            <CardHeader>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                                                        <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(index)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground italic border border-muted">
                                                    "{article.summary}"
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        {length} length
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        {tone} tone
                                                    </span>
                                                    {article.image_keyword && (
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                                                            IMG: {article.image_keyword}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => handlePublish(article)}>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Publish Now
                                                    </Button>
                                                    <Button variant="outline" className="flex-1" onClick={() => {
                                                        navigator.clipboard.writeText(article.content);
                                                        toast({ title: "Copied HTML", description: "Content copied to clipboard" });
                                                    }}>
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Copy HTML
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-[600px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                                <Sparkles className="w-16 h-16 mb-4 text-muted-foreground/20" />
                                <h3 className="text-xl font-medium text-foreground">Ready to Create</h3>
                                <p className="max-w-md text-center mt-2">
                                    Configure your settings on the left and click "Generate" to start the AI creation process.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {editingArticle && (
                    <AddEditArticleModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            // Article was saved successfully, just close modal
                            setIsEditModalOpen(false);
                            setEditingArticle(null);
                        }}
                        initialData={editingArticle}
                    />
                )}
            </div>
        </div>
    );
};

// Helper Icon Component
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export default AdminAIArticles;
