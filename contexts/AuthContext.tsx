"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { User } from '@/types/auth/auth';
import { logoutAction } from '@/app/actions/auth';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    initialUser: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialUser }) => {
    const [user, setUser] = useState<User | null>(initialUser);

    const login = useCallback((newUser: User) => {
        setUser(newUser);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutAction();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
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
