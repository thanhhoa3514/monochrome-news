
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const displayLanguage = language === 'vi' ? 'VI' : 'EN';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1"
    >
      <Globe className="h-4 w-4" />
      <span>{displayLanguage}</span>
    </Button>
  );
}
