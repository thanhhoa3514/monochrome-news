import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSubscriptionData } from '@/data/mockSubscriptionData';

const AdminSubscriptions = () => {
    const [subscriptionSearch, setSubscriptionSearch] = useState('');

    const filteredSubscriptions = mockSubscriptionData.filter(sub =>
        sub.userName.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
        sub.userEmail.toLowerCase().includes(subscriptionSearch.toLowerCase()) ||
        sub.planName.toLowerCase().includes(subscriptionSearch.toLowerCase())
    );

    const stats = {
        activeSubscriptions: mockSubscriptionData.filter(s => s.status === 'active').length,
        totalRevenue: mockSubscriptionData
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + s.amount, 0)
    };

    const getSubscriptionStatusBadge = (status: 'active' | 'cancelled' | 'expired' | 'pending') => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-600">Active</Badge>;
            case 'cancelled':
                return <Badge className="bg-orange-600">Cancelled</Badge>;
            case 'expired':
                return <Badge variant="outline" className="border-destructive text-destructive">Expired</Badge>;
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
        }
    };

    const getPlanTypeBadge = (planType: 'free' | 'basic' | 'premium' | 'enterprise') => {
        switch (planType) {
            case 'free':
                return <Badge variant="outline">Free</Badge>;
            case 'basic':
                return <Badge className="bg-blue-600">Basic</Badge>;
            case 'premium':
                return <Badge className="bg-purple-600">Premium</Badge>;
            case 'enterprise':
                return <Badge className="bg-primary text-primary-foreground">Enterprise</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-serif">Subscription Management</h2>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search subscriptions..."
                        value={subscriptionSearch}
                        onChange={(e) => setSubscriptionSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Renewal</TableHead>
                                    <TableHead>Auto-Renew</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSubscriptions.map((subscription) => (
                                    <TableRow key={subscription.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{subscription.userName}</span>
                                                <span className="text-xs text-muted-foreground">{subscription.userEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{subscription.planName}</TableCell>
                                        <TableCell>{getPlanTypeBadge(subscription.planType)}</TableCell>
                                        <TableCell>{getSubscriptionStatusBadge(subscription.status)}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {subscription.currency} ${subscription.amount.toFixed(2)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{subscription.startDate}</TableCell>
                                        <TableCell>{subscription.renewalDate}</TableCell>
                                        <TableCell>
                                            {subscription.autoRenew ? (
                                                <Badge className="bg-green-600">Yes</Badge>
                                            ) : (
                                                <Badge variant="outline">No</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={subscription.status === 'active' ? 'text-destructive hover:bg-destructive/10' : ''}
                                                >
                                                    {subscription.status === 'active' ? 'Cancel' : 'Reactivate'}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSubscriptions;
