"use client";
import { Shield, FileEdit, LogOut, Crown } from 'lucide-react';
import React from 'react';
import NextLink from 'next/link';
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
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/lib/language-context';

const AuthLink = () => {
    const { user, isAuthenticated, canAccessPremium, logout } = useAuth();
    const { t } = useLanguage();
    
    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
                <>
                    {canAccessPremium ? (
                        <div className="hidden items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 md:flex">
                            <Crown className="h-3.5 w-3.5" />
                            Premium
                        </div>
                    ) : (
                        <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
                            <NextLink href="/pricing">
                                <Crown className="mr-2 h-4 w-4" />
                                Upgrade
                            </NextLink>
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-border/40 hover:border-border transition-colors">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground italic">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {!canAccessPremium && (
                                <>
                                    <DropdownMenuItem asChild>
                                        <NextLink href="/pricing" className="cursor-pointer flex items-center">
                                            <Crown className="mr-2 h-4 w-4" />
                                            <span>Upgrade Plan</span>
                                        </NextLink>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            {user.roles?.some(r => r.slug === 'admin') && (
                                <DropdownMenuItem asChild>
                                    <NextLink href="/admin" className="cursor-pointer flex items-center">
                                        <Shield className="mr-2 h-4 w-4" />
                                        <span>{t('nav.admin') || 'Quản trị'}</span>
                                    </NextLink>
                                </DropdownMenuItem>
                            )}
                            {user.roles?.some(r => r.slug === 'editor') && !user.roles?.some(r => r.slug === 'admin') && (
                                <DropdownMenuItem asChild>
                                    <NextLink href="/editor" className="cursor-pointer flex items-center">
                                        <FileEdit className="mr-2 h-4 w-4" />
                                        <span>{t('nav.editor') || 'Biên tập'}</span>
                                    </NextLink>
                                </DropdownMenuItem>
                            )}
                            {(user.roles?.some(r => r.slug === 'admin') || user.roles?.some(r => r.slug === 'editor')) && (
                                <DropdownMenuSeparator />
                            )}
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{t('nav.logout') || 'Đăng xuất'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
                        <NextLink href="/pricing">
                            <Crown className="mr-2 h-4 w-4" />
                            Upgrade
                        </NextLink>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="font-medium">
                        <NextLink href="/login">
                            {t('nav.login') || 'Đăng nhập'}
                        </NextLink>
                    </Button>
                    <Button asChild size="sm" className="bg-actionRed hover:bg-actionRed/90 text-white font-medium shadow-sm transition-all hover:shadow-md active:scale-95">
                        <NextLink href="/register">
                            {t('nav.register') || 'Đăng ký'}
                        </NextLink>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AuthLink;
