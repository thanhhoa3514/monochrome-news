import NewsCard from './NewsCard';
import { useLanguage } from "@/lib/language-context";
import { News } from '@/types/news';

interface NewsListProps {
  title?: string;
  articles: News[];
  featured?: boolean;
  layout?: 'grid' | 'list';
  className?: string;
  containerClassName?: string;
}

export default function NewsList({ title, articles, featured = false, layout = 'grid', className = "", containerClassName }: NewsListProps) {
  const { t } = useLanguage();

  if (articles.length === 0) {
    return <div className="text-center py-10">{t('no.articles.found')}</div>;
  }

  const defaultGridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  const defaultListClass = "flex flex-col gap-6";

  let finalContainerClass = "";

  if (containerClassName) {
    finalContainerClass = containerClassName;
  } else if (featured) {
    finalContainerClass = "";
  } else {
    finalContainerClass = layout === 'grid' ? defaultGridClass : defaultListClass;
  }

  return (
    <section className={`mb-12 ${className}`}>
      {title && (
        <h2 className="text-2xl font-serif font-bold mb-6 pb-2 border-b">
          {title}
        </h2>
      )}

      <div className={finalContainerClass}>
        {articles.map((article) => (
          <NewsCard key={article.id} news={article} featured={featured} />
        ))}
      </div>
    </section>
  );
}
