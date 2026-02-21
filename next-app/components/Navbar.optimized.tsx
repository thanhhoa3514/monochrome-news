import { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Crown, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/lib/language-context';
import SearchCommand from './SearchCommand';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import subscriptionService from '@/services/subscriptionService';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const categories = [
    { name: "politics", slug: "politics" },
    { name: "economy", slug: "economy" },
    { name: "tech", slug: "technology" },
    { name: "sports", slug: "sports" },
    { name: "culture", slug: "culture" },
    { name: "science", slug: "science" },
];

const getPlanBadgeStyle = (planName?: string) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('premium') || name.includes('pro')) {
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/25';
    }
    if (name.includes('basic') || name.includes('starter')) {
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0';
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { t } = useLanguage();
    const { user, isAuthenticated, logout } = useAuth();

    // OPTIMIZATION: Use React Query for subscription caching
    const { data: subscription } = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: () => subscriptionService.getCurrentSubscription(),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });

    // OPTIMIZATION: Memoize callbacks to prevent unnecessary re-renders
    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const toggleSearch = useCallback(() => {
        setSearchOpen(prev => !prev);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
        setIsMenuOpen(false);
    }, [logout]);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const hasActiveSubscription = subscription?.status === 'active';

    return (
        <header className="border-b border-border sticky top-0 bg-background z-50">
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2 font-serif font-bold text-2xl">
                            <img src="/favicon.svg" alt="NewsPortal Logo" className="h-8 w-8" />
                            <span className="hidden sm:inline">NewsPortal</span>
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
                        {/* Subscription Badge or Upgrade Button */}
                        {isAuthenticated && hasActiveSubscription ? (
                            <Badge
                                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium ${getPlanBadgeStyle(subscription?.plan?.name)}`}
                            >
                                <Crown className="h-3.5 w-3.5" />
                                {subscription?.plan?.name || 'Premium'}
                            </Badge>
                        ) : (
                            <Button
                                variant="outline"
                                className="hidden md:flex border-actionRed text-actionRed hover:bg-actionRed hover:text-white transition-colors gap-1.5"
                                asChild
                            >
                                <Link to="/pricing">
                                    <Sparkles className="h-4 w-4" />
                                    Upgrade
                                </Link>
                            </Button>
                        )}

                        {/* Search */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSearch}
                            aria-label="Search"
                        >
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
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full"
                                            aria-label="User menu"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                                    {hasActiveSubscription && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                            {subscription?.plan?.name}
                                                        </Badge>
                                                    )}
                                                </div>
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
                                        {!hasActiveSubscription && (
                                            <DropdownMenuItem asChild>
                                                <Link to="/pricing" className="cursor-pointer text-actionRed">
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    <span>Upgrade Plan</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
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
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
                                    onClick={closeMenu}
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
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{user.name}</span>
                                                    {hasActiveSubscription && (
                                                        <Badge className={`text-[10px] px-1.5 py-0 ${getPlanBadgeStyle(subscription?.plan?.name)}`}>
                                                            {subscription?.plan?.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                        {!hasActiveSubscription && (
                                            <Link to="/pricing" onClick={closeMenu}>
                                                <Button variant="outline" className="w-full border-actionRed text-actionRed hover:bg-actionRed hover:text-white">
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Upgrade Plan
                                                </Button>
                                            </Link>
                                        )}
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
                                            onClick={closeMenu}
                                        >
                                            {t('nav.login')}
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={closeMenu}
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
};

// Export memoized component
export default memo(Navbar);
