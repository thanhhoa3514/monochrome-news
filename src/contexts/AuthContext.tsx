import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth/auth';
import { authService } from '@/services/authService';
import { API_URL } from '@/config/environment';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authService.me();
                if (data) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // Not authenticated or cookie expired
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (newUser: User) => {
        setUser(newUser);
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            await fetch(`${API_URL}/api/v1/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear token and user state
            localStorage.removeItem('auth_token');
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

