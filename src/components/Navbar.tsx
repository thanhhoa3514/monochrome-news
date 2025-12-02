
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/lib/language-context';
import SearchCommand from './SearchCommand';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const categories = [
  { name: "politics", slug: "politics" },
  { name: "economy", slug: "economy" },
  { name: "tech", slug: "technology" },
  { name: "sports", slug: "sports" },
  { name: "culture", slug: "culture" },
  { name: "science", slug: "science" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="font-serif font-bold text-2xl">
              NewsPortal
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="hover:text-actionRed transition-colors"
              >
                {t(`nav.${category.slug}`)}
              </Link>
            ))}
          </nav>

          {/* Actions Group */}
          <div className="flex items-center space-x-2">
            {/* Upgrade Button */}
            <Button variant="outline" className="hidden md:flex border-actionRed text-actionRed hover:bg-actionRed hover:text-white transition-colors" asChild>
              <Link to="/pricing">
                Upgrade
              </Link>
            </Button>

            {/* Search */}
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Links */}
            <div className="hidden md:flex space-x-2 items-center">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/user/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('nav.logout') || 'Đăng xuất'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">{t('nav.login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-actionRed hover:bg-actionRed-hover">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="hover:text-actionRed transition-colors text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`nav.${category.slug}`)}
                </Link>
              ))}

              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-2 px-2 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600 hover:text-red-600 hover:bg-red-100/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.logout') || 'Đăng xuất'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hover:text-actionRed transition-colors text-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="bg-actionRed hover:bg-actionRed-hover w-full">
                        {t('nav.register')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Search Command Dialog */}
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
