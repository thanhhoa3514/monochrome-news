
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsList from '@/components/NewsList';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { newsService } from '@/services/newsService';
import { News } from '@/types/news';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [searchResults, setSearchResults] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput });
  };

  // Update search input when URL query changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await newsService.getNews({ q: query });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-serif font-bold mb-6">
          {query
            ? t('search.results.for', { query })
            : t('search.results')}
        </h1>

        <form onSubmit={handleSearchSubmit} className="mb-8 flex gap-2">
          <Input
            placeholder={t('search.placeholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-lg"
          />
          <Button type="submit" className="bg-actionRed hover:bg-actionRed-hover">
            <Search className="h-4 w-4 mr-2" />
            {t('search')}
          </Button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-actionRed" />
          </div>
        ) : query ? (
          <>
            <p className="mb-4">
              {searchResults.length === 0
                ? t('search.no.results.found')
                : t('search.found.results', { count: searchResults.length })}
            </p>
            <NewsList articles={searchResults} />
          </>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            {t('search.enter.query')}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
