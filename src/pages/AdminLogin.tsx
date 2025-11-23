import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { Shield, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/auth/auth';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Missing Credentials",
                description: "Please enter both email and password.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });
            console.log(response);

            // Check if user has roles
            if (!response.user.roles || response.user.roles.length === 0) {
                toast({
                    title: "Access Denied",
                    description: "Your account has no assigned roles.",
                    variant: "destructive",
                });
                navigate('/login');
                return;
            }

            // Check for specific roles across ALL assigned roles
            const hasAdminRole = response.user.roles.some(role => role.slug === 'admin' || role.name === 'Admin' || role.name === 'admin');
            const hasEditorRole = response.user.roles.some(role => role.slug === 'editor' || role.name === 'Editor' || role.name === 'editor');

            if (hasAdminRole) {
                // Update global auth state
                login(response.user as User);

                toast({
                    title: "Welcome Admin",
                    description: "You have full access to the admin dashboard.",
                    variant: "default",
                });
                navigate('/admin');
            } else if (hasEditorRole) {
                // Update global auth state
                login(response.user as User);

                toast({
                    title: "Welcome Editor",
                    description: "You have access to the editor dashboard.",
                    variant: "default",
                });
                navigate('/editor');
            } else {
                toast({
                    title: "Access Denied",
                    description: "You do not have permission to access this page. Only admin and editor roles are allowed.",
                    variant: "destructive",
                });
                navigate('/login');
            }

        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message || "Invalid credentials. Please check your email and password.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Hero/Image */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 text-2xl font-bold font-serif">
                        <Shield className="w-8 h-8" />
                        <span>NewsPortal Admin</span>
                    </div>
                </div>
                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl font-bold leading-tight">
                        Manage your content with confidence and precision.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Secure access to the editorial dashboard, user management, and system settings.
                    </p>
                </div>
                <div className="relative z-10 text-sm text-zinc-500">
                    &copy; 2024 NewsPortal Inc. Secure System.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
                        <p className="text-muted-foreground mt-2">
                            Enter your credentials to access the dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@newsportal.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                        autoComplete="email"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>Protected by enterprise-grade security.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
