"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { User } from '@/types/auth/auth';
import { logoutAction } from '@/app/actions/auth';
import { clientAuthService } from '@/lib/client';

interface AuthContextType {
    user: User | null;
    canAccessPremium: boolean;
    login: (user: User, canAccessPremium?: boolean) => void;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    initialUser: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialUser }) => {
    const [user, setUser] = useState<User | null>(initialUser);
    const [canAccessPremium, setCanAccessPremium] = useState(false);

    const refreshAuth = useCallback(async () => {
        try {
            const response = await clientAuthService.me();
            setUser(response.user);
            setCanAccessPremium(response.can_access_premium);
        } catch {
            setUser(null);
            setCanAccessPremium(false);
        }
    }, []);

    useEffect(() => {
        if (initialUser) {
            return;
        }

        let isCancelled = false;

        const hydrateUser = async () => {
            try {
                const response = await clientAuthService.me();

                if (!isCancelled) {
                    setUser(response.user);
                    setCanAccessPremium(response.can_access_premium);
                }
            } catch {
                if (!isCancelled) {
                    setUser(null);
                    setCanAccessPremium(false);
                }
            }
        };

        void hydrateUser();

        return () => {
            isCancelled = true;
        };
    }, [initialUser]);

    const login = useCallback((newUser: User, nextCanAccessPremium = false) => {
        setUser(newUser);
        setCanAccessPremium(nextCanAccessPremium);
    }, []);

    const logout = useCallback(async () => {
        await logoutAction();
        setUser(null);
        setCanAccessPremium(false);
    }, []);

    const value = useMemo(() => ({
        user,
        canAccessPremium,
        login,
        logout,
        refreshAuth,
        isAuthenticated: !!user,
    }), [user, canAccessPremium, login, logout, refreshAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
