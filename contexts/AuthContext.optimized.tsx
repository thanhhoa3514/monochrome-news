"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { User } from '@/types/auth/auth';
import { clientApiClient } from '@/lib/client-api';

interface AuthContextType {
    user: User | null;
    login: (user: User, token?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    initialUser: User | null;
}

/**
 * Optimized AuthProvider:
 * - Receives `initialUser` from Server Component (no client-side fetch needed)
 * - Memoized context value to prevent unnecessary re-renders
 * - useCallback for login/logout to maintain stable references
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialUser }) => {
    const [user, setUser] = useState<User | null>(initialUser);

    const login = useCallback((newUser: User, token?: string) => {
        if (token) {
            localStorage.setItem('auth_token', token);
        }
        setUser(newUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await clientApiClient.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated: !!user,
    }), [user, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
