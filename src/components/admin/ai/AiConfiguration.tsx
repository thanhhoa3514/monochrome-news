import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Loader2 } from 'lucide-react';
import { Category } from '@/types/news';

interface AiConfigurationProps {
    categories: Category[];
    aiCategoryId: string;
    setAiCategoryId: (id: string) => void;
    aiArticleCount: number;
    setAiArticleCount: (count: number) => void;
    language: string;
    setLanguage: (lang: string) => void;
    tone: string;
    setTone: (tone: string) => void;
    length: string;
    setLength: (len: string) => void;
    includeImage: boolean;
    setIncludeImage: (include: boolean) => void;
    aiPrompt: string;
    setAiPrompt: (prompt: string) => void;
    isGenerating: boolean;
    handleGenerate: () => void;
}

const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const AiConfiguration: React.FC<AiConfigurationProps> = ({
    categories,
    aiCategoryId,
    setAiCategoryId,
    aiArticleCount,
    setAiArticleCount,
    language,
    setLanguage,
    tone,
    setTone,
    length,
    setLength,
    includeImage,
    setIncludeImage,
    aiPrompt,
    setAiPrompt,
    isGenerating,
    handleGenerate
}) => {
    return (
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
                            <SelectItem value="short">Short (&lt; 1000 words)</SelectItem>
                            <SelectItem value="medium">Medium (1000 - 2500 words)</SelectItem>
                            <SelectItem value="long">Long Form (&gt; 3000 words)</SelectItem>
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
    );
};

export default AiConfiguration;
