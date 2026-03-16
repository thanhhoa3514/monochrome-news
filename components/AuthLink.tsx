"use client";
import { User, LogOut } from 'lucide-react';
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
    const { user, isAuthenticated, logout } = useAuth();
    const { t } = useLanguage();
    
    const handleLogout = () => {
        logout();
    };

    return (
        <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
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
                        <DropdownMenuItem asChild>
                            <NextLink href="/profile" className="cursor-pointer flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>{t('nav.profile') || 'Hồ sơ'}</span>
                            </NextLink>
                        </DropdownMenuItem>
                        {user.roles?.some(r => r.slug === 'admin') && (
                            <DropdownMenuItem asChild>
                                <NextLink href="/admin" className="cursor-pointer flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{t('nav.admin') || 'Quản trị'}</span>
                                </NextLink>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{t('nav.logout') || 'Đăng xuất'}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                    <NextLink href="/login">
                        <Button variant="ghost" size="sm" className="font-medium">
                            {t('nav.login') || 'Đăng nhập'}
                        </Button>
                    </NextLink>
                    <NextLink href="/register">
                        <Button size="sm" className="bg-actionRed hover:bg-actionRed/90 text-white font-medium shadow-sm transition-all hover:shadow-md active:scale-95">
                            {t('nav.register') || 'Đăng ký'}
                        </Button>
                    </NextLink>
                </div>
            )}
        </div>
    );
};

export default AuthLink;