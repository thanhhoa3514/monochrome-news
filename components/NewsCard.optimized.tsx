import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { News } from '@/types/news';
import { formatNewsDate, calculateReadTime, getExcerpt } from '@/utils/newsHelpers';

interface NewsCardProps {
    news: News;
    featured?: boolean;
}

const NewsCard = ({ news, featured = false }: NewsCardProps) => {
    const { t } = useLanguage();

    // Memoize expensive calculations
    const formattedDate = useMemo(() => formatNewsDate(news.published_at), [news.published_at]);
    const readTime = useMemo(() => calculateReadTime(news.content, t), [news.content, t]);
    const excerpt = useMemo(() => getExcerpt(news.content), [news.content]);

    return (
        <article className={`group ${featured ? 'lg:grid lg:grid-cols-2 lg:gap-8' : ''} mb-8 animate-fade-in`}>
            {/* Image with optimized loading */}
            <div className={`overflow-hidden rounded-lg ${featured ? 'h-64 lg:h-full' : 'h-48 md:h-56'}`}>
                <Link to={`/news/${news.id}`}>
                    <img
                        src={news.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                    />
                </Link>
            </div>

            {/* Content */}
            <div className={`py-4 ${featured ? 'lg:py-0' : ''}`}>
                <div className="flex items-center space-x-4 mb-2">
                    {news.category && (
                        <Badge variant="outline" className="bg-actionRed/10 text-actionRed border-actionRed/20">
                            {news.category.name}
                        </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{formattedDate}</span>
                    <span className="text-sm text-muted-foreground">{readTime}</span>
                </div>

                <Link to={`/news/${news.id}`}>
                    <h2 className={`font-serif font-bold ${featured ? 'text-2xl md:text-3xl' : 'text-xl'} mb-2 group-hover:text-actionRed transition-colors duration-200 group-hover:translate-x-1`}>
                        {news.title}
                    </h2>
                </Link>

                <p className="text-muted-foreground">{excerpt}</p>

                <Link
                    to={`/news/${news.id}`}
                    className="inline-block mt-4 text-actionRed font-medium hover:underline transition-all duration-200 hover:translate-x-1"
                >
                    {t('read.more')}
                </Link>
            </div>
        </article>
    );
};

// Memoize component with custom comparison
export default memo(NewsCard, (prevProps, nextProps) => {
    return prevProps.news.id === nextProps.news.id &&
        prevProps.featured === nextProps.featured;
});
