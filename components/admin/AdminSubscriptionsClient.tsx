"use client";

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Filter, Loader2, Download, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import SubscriptionTable from './subscriptions/SubscriptionTable';
import PaginationControl from '@/components/common/PaginationControl';
import { Subscription } from '@/types/subscription';
import { cancelSubscriptionAction, activateSubscriptionAction } from '@/actions/subscriptions';

interface AdminSubscriptionsClientProps {
    initialSubscriptions: Subscription[];
    totalPages: number;
    currentPage: number;
    initialStatus: string;
    initialPlanId: string;
}

const AdminSubscriptionsClient = ({
    initialSubscriptions,
    totalPages,
    currentPage,
    initialStatus,
    initialPlanId
}: AdminSubscriptionsClientProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    const [subscriptionSearch, setSubscriptionSearch] = useState('');

    const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
    const [planFilter, setPlanFilter] = useState<string>(initialPlanId);

    const applyFilters = (status: string, plan: string, page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status && status !== 'all') {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        if (plan && plan !== 'all') {
            params.set('plan_id', plan);
        } else {
            params.delete('plan_id');
        }

        if (page > 1) {
            params.set('page', page.toString());
        } else {
            params.delete('page');
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handleStatusChange = (val: string) => {
        setStatusFilter(val);
        applyFilters(val, planFilter, 1);
    }

    const handlePlanChange = (val: string) => {
        setPlanFilter(val);
        applyFilters(statusFilter, val, 1);
    }

    const handlePageChange = (page: number) => {
        applyFilters(statusFilter, planFilter, page);
    }

    const filteredSubscriptions = initialSubscriptions.filter(sub =>
        sub.user?.name.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
        sub.user?.email.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
        sub.plan?.name.toLowerCase().includes(subscriptionSearch.toLowerCase())
    );

    const stats = {
        activeSubscriptions: initialSubscriptions.filter(s => s.status === 'active').length,
        mrr: initialSubscriptions
            .filter(s => s.status === 'active' && s.plan)
            .reduce((sum, s) => sum + (Number(s.plan?.price) || 0), 0)
    };

    const handleCancel = (id: number) => {
        startTransition(async () => {
            const result = await cancelSubscriptionAction(id);
            if (result.success) {
                toast({ title: "Success", description: "Subscription cancelled successfully" });
            } else {
                toast({ title: "Error", description: "Failed to cancel subscription", variant: "destructive" });
            }
        });
    };

    const handleActivate = (id: number) => {
        startTransition(async () => {
            const result = await activateSubscriptionAction(id);
            if (result.success) {
                toast({ title: "Success", description: "Subscription activated successfully" });
            } else {
                toast({ title: "Error", description: "Failed to activate subscription", variant: "destructive" });
            }
        });
    };

    const handleExportCSV = () => {
        if (!initialSubscriptions.length) {
            toast({ title: "No Data", description: "Nothing to export.", variant: "destructive" });
            return;
        }

        const headers = ["ID", "User Name", "User Email", "Plan", "Price", "Status", "Start Date", "End Date"];
        const rows = initialSubscriptions.map(sub => [
            sub.id,
            sub.user?.name || "Unknown",
            sub.user?.email || "Unknown",
            sub.plan?.name || "Unknown",
            sub.plan?.price || 0,
            sub.status,
            sub.start_date,
            sub.end_date
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "subscriptions_export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold font-serif tracking-tight">Subscription Management</h2>
                    <p className="text-muted-foreground">Manage user subscriptions, plans, and revenue.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportCSV}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeSubscriptions}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            On current page
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">MRR (Monthly Recurring Revenue)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${(Number(stats.mrr) || 0).toFixed(2)}`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Estimated from active subscriptions on current page
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg border">
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto flex-1">
                    <div className="relative flex-1 sm:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search user or plan..."
                            value={subscriptionSearch}
                            onChange={(e) => setSubscriptionSearch(e.target.value)}
                            className="pl-8 bg-background"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full sm:w-[150px] bg-background">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={planFilter} onValueChange={handlePlanChange}>
                        <SelectTrigger className="w-full sm:w-[150px] bg-background">
                            <SelectValue placeholder="Plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Plans</SelectItem>
                            <SelectItem value="1">Basic Plan</SelectItem>
                            <SelectItem value="2">Premium Plan</SelectItem>
                            <SelectItem value="3">Enterprise Plan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className={`space-y-4 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                <SubscriptionTable
                    subscriptions={filteredSubscriptions}
                    isLoading={isPending}
                    onCancel={handleCancel}
                    onActivate={handleActivate}
                    isProcessing={isPending}
                />

                <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

                <div className="text-center text-xs text-muted-foreground">
                    Showing {filteredSubscriptions.length} results
                </div>
            </div>
        </div>
    );
};

export default AdminSubscriptionsClient;
