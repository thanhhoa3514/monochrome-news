"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { registerAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { User as AuthUser } from '@/types/auth/auth';
import { UserPlus, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';

function resolvePostAuthDestination(user: AuthUser): string {
    if (user.roles?.some((role) => role.slug === 'admin' || role.name.toLowerCase() === 'admin')) {
        return '/admin';
    }

    if (user.roles?.some((role) => role.slug === 'editor' || role.name.toLowerCase() === 'editor')) {
        return '/editor';
    }

    return '/';
}

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const { toast } = useToast();

    const requestedRedirect = searchParams.get('redirect');
    const safeRedirect =
        requestedRedirect && /^\/(?!\/)/.test(requestedRedirect)
            ? requestedRedirect
            : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirmation) {
            const message = 'Mật khẩu xác nhận không khớp.';
            setError(message);
            toast({
                title: 'Đăng ký thất bại',
                description: message,
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await registerAction({ 
                name, 
                email, 
                password, 
                password_confirmation: passwordConfirmation 
            });

            if (result.success && result.user) {
                login(result.user, result.canAccessPremium);
                toast({
                    title: 'Tạo tài khoản thành công',
                    description: result.message || 'Tài khoản của bạn đã sẵn sàng sử dụng.',
                });
                router.replace(safeRedirect || resolvePostAuthDestination(result.user));
            } else {
                const message = result.error || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
                setError(message);
                toast({
                    title: 'Đăng ký thất bại',
                    description: message,
                    variant: 'destructive',
                });
            }
        } catch {
            const message = 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.';
            setError(message);
            toast({
                title: 'Lỗi kết nối',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center p-4 bg-muted/30">
            <Link 
                href="/" 
                className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Quay lại trang chủ</span>
            </Link>

            <Card className="w-full max-w-md border-border/40 shadow-xl overflow-hidden bg-background">
                <div className="h-1.5 bg-gradient-to-r from-actionRed via-actionRed/80 to-actionRed/50" />
                
                <CardHeader className="space-y-1 pt-8">
                    <div className="mx-auto bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-primary/10">
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center font-serif font-black tracking-tight">
                        ĐĂNG KÝ
                    </CardTitle>
                    <CardDescription className="text-center font-medium">
                        Tham gia cộng đồng Monochrome News ngay hôm nay
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20 py-2.5">
                                <AlertDescription className="text-xs font-medium">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="name">Họ và tên</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    className="pl-10 h-11 focus-visible:ring-actionRed/20 focus-visible:border-actionRed/50 transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 h-11 focus-visible:ring-actionRed/20 focus-visible:border-actionRed/50 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 focus-visible:ring-actionRed/20 focus-visible:border-actionRed/50 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirmation">Xác nhận</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="passwordConfirmation"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 focus-visible:ring-actionRed/20 focus-visible:border-actionRed/50 transition-all"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 bg-actionRed hover:bg-actionRed/90 text-white font-bold tracking-wide transition-all active:scale-[0.98] mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "ĐĂNG KÝ"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pb-8 border-t border-border/40 mt-6 pt-6 bg-muted/10">
                    <div className="text-center text-sm text-muted-foreground font-medium">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="text-actionRed hover:underline font-bold">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
