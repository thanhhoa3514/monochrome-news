import React, { useState } from 'react';
import { Search, Filter, Loader2, Download, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subscriptionService from '@/services/subscriptionService';
import { toast } from '@/hooks/use-toast';
import SubscriptionTable from './subscriptions/SubscriptionTable';
import PaginationControl from '@/components/common/PaginationControl';

const AdminSubscriptions = () => {
    const [subscriptionSearch, setSubscriptionSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [planFilter, setPlanFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();

    // Fetch subscriptions with filters
    const { data: subscriptionResponse, isLoading } = useQuery({
        queryKey: ['subscriptions', statusFilter, planFilter, currentPage],
        queryFn: () => subscriptionService.getAll({
            status: statusFilter,
            plan_id: planFilter,
            page: currentPage,
            per_page: 10 // Pagination limit
        })
    });

    const subscriptions = subscriptionResponse?.data || [];
    const totalPages = subscriptionResponse?.last_page || 1;

    // Client-side search filtering (until backend supports search)
    // Note: This only filters the CURRENT PAGE of results if we rely on backend pagination.
    // Ideally backend should handle search. For now, we'll filter what we have.
    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.user?.name.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
        sub.user?.email.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
        sub.plan?.name.toLowerCase().includes(subscriptionSearch.toLowerCase())
    );

    // Stats calculation (Note: This is only for current page/fetched data. 
    // Real stats should come from a dedicated API endpoint for accuracy)
    const stats = {
        activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
        mrr: subscriptions
            .filter(s => s.status === 'active' && s.plan)
            .reduce((sum, s) => sum + (s.plan?.price || 0), 0)
    };

    // Mutations
    const cancelMutation = useMutation({
        mutationFn: subscriptionService.cancel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            toast({ title: "Success", description: "Subscription cancelled successfully" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to cancel subscription", variant: "destructive" });
        }
    });

    const activateMutation = useMutation({
        mutationFn: subscriptionService.activate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            toast({ title: "Success", description: "Subscription activated successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to activate subscription",
                variant: "destructive"
            });
        }
    });

    const handleExportCSV = () => {
        if (!subscriptions.length) {
            toast({ title: "No Data", description: "Nothing to export.", variant: "destructive" });
            return;
        }

        const headers = ["ID", "User Name", "User Email", "Plan", "Price", "Status", "Start Date", "End Date"];
        const rows = subscriptions.map(sub => [
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeSubscriptions}
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
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${stats.mrr.toFixed(2)}`}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Estimated from active subscriptions on current page
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
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

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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

                    <Select value={planFilter} onValueChange={setPlanFilter}>
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

            {/* Table & Pagination */}
            <div className="space-y-4">
                <SubscriptionTable
                    subscriptions={filteredSubscriptions}
                    isLoading={isLoading}
                    onCancel={(id) => cancelMutation.mutate(id)}
                    onActivate={(id) => activateMutation.mutate(id)}
                    isProcessing={cancelMutation.isPending || activateMutation.isPending}
                />

                <PaginationControl
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                <div className="text-center text-xs text-muted-foreground">
                    Showing {filteredSubscriptions.length} results
                </div>
            </div>
        </div>
    );
};

export default AdminSubscriptions;
