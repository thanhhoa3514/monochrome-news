"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Sparkles, History } from 'lucide-react';
import AddEditArticleModal from '@/components/modals/AddEditArticleModal';
import { generateAiNewsAction, publishAiArticleAction, fetchAiHistoryAction } from '@/actions/ai-articles';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types/news';

// Import Sub-components
import AiHistorySidebar from './ai/AiHistorySidebar';
import AiConfiguration from './ai/AiConfiguration';
import AiProcessing from './ai/AiProcessing';
import AiResults from './ai/AiResults';

interface AdminAIArticlesClientProps {
    initialCategories: Category[];
    initialHistory: any[];
}

const AdminAIArticlesClient = ({ initialCategories, initialHistory }: AdminAIArticlesClientProps) => {
    const { user } = useAuth();
    // Configuration State
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [aiCategoryId, setAiCategoryId] = useState<string>(initialCategories.length > 0 ? initialCategories[0].id.toString() : '');
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
    const [history, setHistory] = useState<any[]>(initialHistory);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<any>(null);

    // Fetch History
    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const result = await fetchAiHistoryAction();
            if (result.success) {
                setHistory(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

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

        // Simulate AI Process
        addLog(`Connecting to Gemini AI...`);
        setTimeout(() => addLog(`Authenticating secure session...`), 800);
        setTimeout(() => addLog(`Sending request to backend...`), 1500);

        try {
            // Call Server Action
            const result = await generateAiNewsAction({
                category: categoryName,
                count: aiArticleCount,
                language: language,
                tone: tone,
                length: length,
                prompt: aiPrompt
            });

            addLog(`Received response from server.`);

            if (result.success && result.data) {
                let articles = [];
                if (Array.isArray(result.data)) {
                    articles = result.data;
                } else if (result.data.data) {
                    articles = result.data.data;
                    setCurrentGenerationId(result.data.generation_id || null);
                }

                setGeneratedArticles(articles);
                addLog(`Success! Generated ${articles.length} articles.`);
                toast({
                    title: "Generation Complete",
                    description: `Successfully generated ${articles.length} articles.`,
                });
                fetchHistory();
            } else {
                throw new Error(result.error || 'Generation failed');
            }
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

        if (!currentGenerationId) {
            toast({ title: "Error", description: "No generation ID found.", variant: "destructive" });
            return;
        }

        try {
            const result = await publishAiArticleAction({
                generation_id: currentGenerationId,
                article_index: generatedArticles.indexOf(article),
                category_id: Number(aiCategoryId),
                user_id: user.id,
            });

            if (result.success) {
                fetchHistory();
                toast({
                    title: "Article Published",
                    description: `"${article.title}" has been saved with permanent image.`,
                });
            } else {
                throw new Error(result.error || 'Failed to publish');
            }
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

    return (
        <div className="flex h-full gap-6">
            {/* HISTORY SIDEBAR */}
            <AiHistorySidebar
                history={history}
                isLoadingHistory={isLoadingHistory}
                isHistoryOpen={isHistoryOpen}
                setIsHistoryOpen={setIsHistoryOpen}
                currentGenerationId={currentGenerationId}
                loadFromHistory={loadFromHistory}
            />

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
                            <p className="text-muted-foreground">Google Gemini AI</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                        <Sparkles className="w-3 h-3 mr-2 fill-primary" />
                        AI Model: Gemini
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: CONFIGURATION */}
                    <div className="lg:col-span-4 space-y-6">
                        <AiConfiguration
                            categories={categories}
                            aiCategoryId={aiCategoryId}
                            setAiCategoryId={setAiCategoryId}
                            aiArticleCount={aiArticleCount}
                            setAiArticleCount={setAiArticleCount}
                            language={language}
                            setLanguage={setLanguage}
                            tone={tone}
                            setTone={setTone}
                            length={length}
                            setLength={setLength}
                            includeImage={includeImage}
                            setIncludeImage={setIncludeImage}
                            aiPrompt={aiPrompt}
                            setAiPrompt={setAiPrompt}
                            isGenerating={isGenerating}
                            handleGenerate={handleGenerate}
                        />
                    </div>

                    {/* RIGHT COLUMN: PREVIEW & PROCESSING */}
                    <div className="lg:col-span-8 space-y-6">
                        {isGenerating ? (
                            <AiProcessing logs={logs} />
                        ) : (
                            <AiResults
                                generatedArticles={generatedArticles}
                                setGeneratedArticles={setGeneratedArticles}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handlePublish={handlePublish}
                                length={length}
                                tone={tone}
                            />
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {editingArticle && (
                    <AddEditArticleModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            setEditingArticle(null);
                        }}
                        initialData={editingArticle}
                        categories={categories}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminAIArticlesClient;
