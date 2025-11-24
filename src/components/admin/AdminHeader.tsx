import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="border-b bg-card">
            <div className="container flex items-center justify-between h-16 px-4">
                <h1 className="font-serif text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button variant="outline" onClick={() => navigate('/')}>Back to Site</Button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
