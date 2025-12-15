import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, User as UserIcon, CreditCard, Calendar, Shield, Pencil, Lock } from 'lucide-react';
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
    const { user, isAuthenticated, logout, login } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Edit Profile Modal State
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAvatar, setEditAvatar] = useState<File | null>(null);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Change Password Modal State
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

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

    // Open Edit Profile Modal
    const openEditProfile = () => {
        if (profile) {
            setEditName(profile.name);
            setEditAvatar(null);
        }
        setIsEditProfileOpen(true);
    };

    // Handle Edit Profile Submit
    const handleUpdateProfile = async () => {
        if (!editName.trim()) {
            toast({ title: "Error", description: "Name is required", variant: "destructive" });
            return;
        }

        setIsUpdatingProfile(true);
        try {
            const formData = new FormData();
            formData.append('name', editName);
            if (editAvatar) {
                formData.append('avatar', editAvatar);
            }

            const result = await authService.updateProfile(formData);

            // Update local profile state
            setProfile(prev => prev ? { ...prev, name: editName, avatar: result.user?.avatar || prev.avatar } : null);

            // Update auth context
            if (result.user) {
                login(result.user);
            }

            toast({ title: "Success", description: "Profile updated successfully!" });
            setIsEditProfileOpen(false);
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to update profile", variant: "destructive" });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    // Handle Change Password Submit
    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
            return;
        }

        if (newPassword.length < 8) {
            toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
            return;
        }

        setIsChangingPassword(true);
        try {
            await authService.changePassword(currentPassword, newPassword, confirmPassword);
            toast({ title: "Success", description: "Password changed successfully!" });
            setIsChangePasswordOpen(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to change password", variant: "destructive" });
        } finally {
            setIsChangingPassword(false);
        }
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

                            {/* Account Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <UserIcon className="w-5 h-5 mr-2" />
                                        Account Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Button variant="outline" className="justify-start" onClick={() => setIsChangePasswordOpen(true)}>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Change Password
                                        </Button>
                                        <Button variant="outline" className="justify-start" onClick={openEditProfile}>
                                            <Pencil className="w-4 h-4 mr-2" />
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

            {/* Edit Profile Dialog */}
            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update your profile information</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditAvatar(e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
                            {isUpdatingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Enter your current password and a new password</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                            {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Change Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

