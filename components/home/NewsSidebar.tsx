import React from 'react';
import Link from 'next/link';
import { News } from '@/types/news';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Tag, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsSidebarProps {
    trendingArticles: News[];
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({ trendingArticles }) => {
    // Mock tags for now, ideally fetched from API
    const tags = ['Technology', 'AI', 'Business', 'Startup', 'Design', 'Crypto', 'Health', 'Science'];

    return (
        <div className="space-y-8">
            {/* Trending Section */}
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-2 font-serif text-xl">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Trending Now
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 grid gap-4">
                    {trendingArticles.map((article, index) => (
                        <Link
                            key={article.id}
                            href={`/news/${article.id}`}
                            className="group flex items-start gap-4"
                        >
                            <span className="text-3xl font-bold text-muted-foreground/20 font-serif -mt-2 group-hover:text-primary/40 transition-colors">
                                {index + 1}
                            </span>
                            <div className="space-y-1">
                                <h4 className="font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {article.title}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                    {article.category?.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>

            {/* Tags Cloud */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-serif text-xl font-semibold">
                    <Tag className="w-5 h-5 text-primary" />
                    Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Newsletter Banner */}
            <div className="bg-muted/50 rounded-xl p-6 text-center space-y-4 border border-border/50">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg">Subscribe to Newsletter</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get the latest news delivered to your inbox daily.
                    </p>
                </div>
                <div className="space-y-2">
                    <Input placeholder="Your email address" className="bg-background" />
                    <Button className="w-full">Subscribe</Button>
                </div>
            </div>
        </div>
    );
};

export default NewsSidebar;
