import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User as UserIcon, CreditCard, Calendar, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    created_at: string;
    roles: {
        id: number;
        name: string;
        slug: string;
    }[];
    subscriptions: {
        id: number;
        status: string;
        start_date: string;
        end_date: string;
        plan: {
            id: number;
            name: string;
            price: number;
            duration_days: number;
        };
    }[];
}

export default function Profile() {
    const { user, isAuthenticated, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const data = await authService.me();
                setProfile(data.user);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                toast({
                    title: "Error",
                    description: "Failed to load profile data. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, navigate, toast]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    const activeSubscription = profile.subscriptions?.find(sub => sub.status === 'active');

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-serif font-bold">My Profile</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Info Card */}
                        <Card className="md:col-span-1">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={profile.avatar} alt={profile.name} />
                                        <AvatarFallback className="text-2xl">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <CardTitle>{profile.name}</CardTitle>
                                <CardDescription>{profile.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Joined {new Date(profile.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Roles: {profile.roles.map(r => r.name).join(', ')}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleLogout}>
                                    Log Out
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Subscription & Details */}
                        <div className="md:col-span-2 space-y-6">
                            {/* My Subscription Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        My Subscription
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {activeSubscription ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                                                <div>
                                                    <h3 className="font-bold text-lg">{activeSubscription.plan.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Valid until {new Date(activeSubscription.end_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" onClick={() => navigate('/pricing')}>
                                                    Change Plan
                                                </Button>
                                                {/* Add Cancel Subscription logic here if needed */}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 space-y-4">
                                            <p className="text-muted-foreground">You don't have an active subscription.</p>
                                            <Button className="bg-actionRed hover:bg-actionRed-hover" onClick={() => navigate('/pricing')}>
                                                Upgrade to Premium
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Additional Settings or Info can go here */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <UserIcon className="w-5 h-5 mr-2" />
                                        Account Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Button variant="outline" className="justify-start">
                                            Change Password
                                        </Button>
                                        <Button variant="outline" className="justify-start">
                                            Edit Profile
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
