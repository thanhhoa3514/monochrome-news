import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { useLanguage } from "@/lib/language-context";
import { News } from '@/types/news';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface NewsCardProps {
  news: News;
  featured?: boolean;
}

export default function NewsCard({ news, featured = false }: NewsCardProps) {
  const { t } = useLanguage();

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  // Helper to calculate read time (approx 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} ${t('read.minutes') || 'phút'}`;
  };

  // Helper to truncate content for excerpt
  const getExcerpt = (content: string, length: number = 150) => {
    const text = content.replace(/<[^>]*>?/gm, ''); // Strip HTML
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <motion.article
      className={`group ${featured ? 'lg:grid lg:grid-cols-2 lg:gap-8' : ''} mb-8`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Image */}
      <div className={`overflow-hidden rounded-lg ${featured ? 'h-64 lg:h-full' : 'h-48 md:h-56'}`}>
        <Link to={`/news/${news.id}`}>
          <motion.img
            src={news.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'}
            alt={news.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
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
          <span className="text-sm text-muted-foreground">{formatDate(news.published_at)}</span>
          <span className="text-sm text-muted-foreground">{calculateReadTime(news.content)}</span>
        </div>

        <Link to={`/news/${news.id}`}>
          <motion.h2
            className={`font-serif font-bold ${featured ? 'text-2xl md:text-3xl' : 'text-xl'} mb-2 group-hover:text-actionRed transition-colors`}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {news.title}
          </motion.h2>
        </Link>

        <p className="text-muted-foreground">{getExcerpt(news.content)}</p>

        <motion.div
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            to={`/news/${news.id}`}
            className="inline-block mt-4 text-actionRed font-medium hover:underline"
          >
            {t('read.more')}
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
