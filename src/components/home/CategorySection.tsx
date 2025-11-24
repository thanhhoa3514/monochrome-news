import React from 'react';
import { Link } from 'react-router-dom';
import { News } from '@/types/news';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategorySectionProps {
    title: string;
    categoryId?: number;
    articles: News[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, categoryId, articles }) => {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="py-8 border-t">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold font-serif relative pl-4">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full"></span>
                        {title}
                    </h2>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {articles.slice(0, 4).map((article) => (
                        <Link key={article.id} to={`/news/${article.id}`} className="group block">
                            <div className="relative overflow-hidden rounded-lg aspect-[3/2] mb-3 bg-muted">
                                <img
                                    src={article.thumbnail || 'https://placehold.co/400x300?text=News'}
                                    alt={article.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                {article.summary}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
