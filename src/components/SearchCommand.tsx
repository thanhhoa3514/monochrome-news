
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Search } from 'lucide-react';
import { mockNewsData } from '@/data/mockNewsData';
import { useLanguage } from '@/lib/language-context';

type SearchCommandProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter news data based on search query
  const filteredResults = searchQuery.length > 1
    ? mockNewsData.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
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
        <CommandEmpty>{t('search.no.results')}</CommandEmpty>
        {filteredResults.length > 0 && (
          <CommandGroup heading={t('search.results')}>
            {filteredResults.slice(0, 5).map((article) => (
              <CommandItem
                key={article.id}
                onSelect={() => handleSelect(article.id)}
                className="flex items-center py-2"
              >
                <Search className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">{article.title}</p>
                  <p className="text-sm text-muted-foreground">{article.category} • {article.date}</p>
                </div>
              </CommandItem>
            ))}
            {filteredResults.length > 5 && (
              <CommandItem
                onSelect={() => {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  onOpenChange(false);
                }}
              >
                {t('search.view.all', { count: filteredResults.length })}
              </CommandItem>
            )}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
