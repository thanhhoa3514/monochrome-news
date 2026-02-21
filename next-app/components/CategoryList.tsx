
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from "@/lib/language-context";
import { newsService } from "@/services/newsService";
import { Category } from "@/types/news";

// Static data for images and descriptions (since not in DB yet)
const categoryAssets: Record<string, { imageUrl: string, descKey: string }> = {
  "politique": {
    descKey: "category.politics.desc",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070"
  },
  "economie": {
    descKey: "category.economy.desc",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070"
  },
  "tech": {
    descKey: "category.tech.desc",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070"
  },
  "sport": {
    descKey: "category.sports.desc",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070"
  },
  "culture": {
    descKey: "category.culture.desc",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071"
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CategoryList() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await newsService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <motion.h2
        className="text-2xl font-serif font-bold mb-6 pb-2 border-b"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        {t('categories.title')}
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {categories.map((category) => {
          const assets = categoryAssets[category.slug] || {
            imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070",
            descKey: "category.default.desc"
          };

          return (
            <motion.div
              key={category.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={`/category/${category.slug}`}
                className="group relative h-40 overflow-hidden rounded-lg block"
              >
                <motion.img
                  src={assets.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col justify-end p-4">
                  <h3 className="text-white font-serif font-bold text-xl">{category.name}</h3>
                  <p className="text-white/80 text-sm">
                    {assets.descKey !== "category.default.desc" ? t(assets.descKey) : `${category.news_count || 0} articles`}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
