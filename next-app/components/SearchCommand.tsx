
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { newsService } from '@/services/newsService';
import { News } from '@/types/news';
import { useDebounce } from '@/hooks/use-debounce';

type SearchCommandProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchNews = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await newsService.getNews({ q: debouncedQuery, per_page: 5 });
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    searchNews();
  }, [debouncedQuery]);

  const handleSelect = (articleId: number) => {
    navigate(`/news/${articleId}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={t('search.placeholder')}
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : (
            t('search.no.results')
          )}
        </CommandEmpty>
        {!loading && results.length > 0 && (
          <CommandGroup heading={t('search.results')}>
            {results.map((article) => (
              <CommandItem
                key={article.id}
                onSelect={() => handleSelect(article.id)}
                className="flex items-center py-2"
              >
                <Search className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">{article.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {article.category?.name} • {article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}
                  </p>
                </div>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                onOpenChange(false);
              }}
            >
              {t('search.view.all', { count: results.length })}
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
