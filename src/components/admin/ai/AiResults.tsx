import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, RefreshCw, Edit, Trash2, FileText, Sparkles, Save, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AiResultsProps {
    generatedArticles: any[];
    setGeneratedArticles: (articles: any[]) => void;
    handleEdit: (article: any) => void;
    handleDelete: (index: number) => void;
    handlePublish: (article: any) => void;
    length: string;
    tone: string;
}

const AiResults: React.FC<AiResultsProps> = ({
    generatedArticles,
    setGeneratedArticles,
    handleEdit,
    handleDelete,
    handlePublish,
    length,
    tone
}) => {
    if (generatedArticles.length === 0) {
        return (
            <div className="h-[600px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                <Sparkles className="w-16 h-16 mb-4 text-muted-foreground/20" />
                <h3 className="text-xl font-medium text-foreground">Ready to Create</h3>
                <p className="max-w-md text-center mt-2">
                    Configure your settings on the left and click "Generate" to start the AI creation process.
                </p>
            </div>
        );
    }

    return (
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
    );
};

export default AiResults;
