import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (userParam) {
            try {
                const user = JSON.parse(decodeURIComponent(userParam));
                login(user);
                navigate('/');
            } catch (err) {
                console.error('Failed to parse user data:', err);
                setError('Failed to process authentication. Please try again.');
                setTimeout(() => navigate('/login'), 3000);
            }
        } else {
            setError('Invalid authentication response');
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [searchParams, login, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="text-destructive text-xl font-semibold">
                        Authentication Error
                    </div>
                    <p className="text-muted-foreground">{error}</p>
                    <p className="text-sm text-muted-foreground">
                        Redirecting to login page...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <p className="text-lg font-medium">Completing authentication...</p>
                <p className="text-sm text-muted-foreground">Please wait</p>
            </div>
        </div>
    );
};

export default AuthCallback;

