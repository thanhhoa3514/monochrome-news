"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { loginAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await loginAction({ email, password });

            if (result.success && result.user) {
                // If loginAction sets cookie, we still update the context
                login(result.user);
                router.push('/');
                router.refresh(); // Ensure header updates
            } else {
                setError(result.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            }
        } catch {
            setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-muted/30">
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
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center font-serif font-black tracking-tight">
                        ĐĂNG NHẬP
                    </CardTitle>
                    <CardDescription className="text-center font-medium">
                        Chào mừng bạn quay trở lại với Monochrome News
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20 py-2.5">
                                <AlertDescription className="text-xs font-medium">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                        
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

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-xs font-medium text-actionRed hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
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

                        <Button 
                            type="submit" 
                            className="w-full h-11 bg-actionRed hover:bg-actionRed/90 text-white font-bold tracking-wide transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "ĐĂNG NHẬP"
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pb-8 border-t border-border/40 mt-6 pt-6 bg-muted/10">
                    <div className="text-center text-sm text-muted-foreground font-medium">
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="text-actionRed hover:underline font-bold">
                            Đăng ký ngay
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
