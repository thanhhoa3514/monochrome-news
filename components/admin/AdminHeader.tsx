import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, LogOut, Home, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ADMIN_TAB_LABELS, AdminTab } from './admin-tabs';
import { useToast } from '@/hooks/use-toast';

interface AdminHeaderProps {
    selectedTab: AdminTab;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ selectedTab }) => {
    const navigate = useRouter();
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            toast({
                title: 'Logged out successfully',
                description: 'Your admin session has been closed.',
            });
            navigate.push('/login');
            navigate.refresh();
        } catch {
            toast({
                title: 'Logout failed',
                description: 'We could not end the admin session right now. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                {/* Breadcrumbs */}
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin" className="flex items-center gap-1">
                                <Home className="h-4 w-4" />
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="cursor-pointer">Admin</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-semibold text-primary">
                                {ADMIN_TAB_LABELS[selectedTab]}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-md hidden md:flex relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search anything (users, articles, settings)..."
                    className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px] focus-visible:ring-1"
                />
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9 border">
                                <AvatarImage src={user?.avatar || ''} alt={user?.name} />
                                <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => void handleLogout()}
                            disabled={isLoggingOut}
                            className="text-red-600 focus:text-red-600 disabled:pointer-events-none disabled:opacity-60"
                        >
                            {isLoggingOut ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LogOut className="mr-2 h-4 w-4" />
                            )}
                            <span>{isLoggingOut ? 'Signing out...' : 'Log out'}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default AdminHeader;
