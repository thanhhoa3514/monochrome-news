import React from 'react';
import Link from 'next/link';
import { News } from '@/types/news';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
interface HeroSectionProps {
    articles: News[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ articles }) => {
    if (!articles || articles.length === 0) return null;

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 3);

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Hero Article (2/3 width) */}
                <div className="lg:col-span-2 group cursor-pointer">
                    <Link href={`/news/${mainArticle.id}`}>
                        <div className="relative overflow-hidden rounded-xl aspect-[16/9] mb-4">
                            <Image
                                src={mainArticle.thumbnail || 'https://placehold.co/800x450?text=News'}
                                alt={mainArticle.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                width={800}
                                height={450}
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    {mainArticle.category?.name || 'News'}
                                </Badge>
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold font-serif leading-tight mb-3 group-hover:text-primary transition-colors">
                            {mainArticle.title}
                        </h1>
                        <p className="text-muted-foreground text-lg line-clamp-2 mb-3">
                            {mainArticle.summary}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <span className="font-medium text-foreground">{mainArticle.user?.name}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {mainArticle.published_at
                                    ? formatDistanceToNow(new Date(mainArticle.published_at), { addSuffix: true })
                                    : 'Just now'}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Side Articles (1/3 width) */}
                <div className="flex flex-col gap-6">
                    {sideArticles.map((article) => (
                        <Link key={article.id} href={`/news/${article.id}`} className="group flex flex-col h-full">
                            <div className="relative overflow-hidden rounded-lg aspect-[3/2] mb-3">
                                <Image
                                    src={article.thumbnail || 'https://placehold.co/400x300?text=News'}
                                    alt={article.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    width={400}
                                    height={300}
                                />
                                <div className="absolute top-2 left-2">
                                    <Badge variant="secondary" className="text-xs backdrop-blur-md bg-background/80">
                                        {article.category?.name}
                                    </Badge>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold font-serif leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <div className="mt-auto flex items-center text-xs text-muted-foreground gap-2">
                                <Clock className="w-3 h-3" />
                                {article.published_at
                                    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
                                    : 'Just now'}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
