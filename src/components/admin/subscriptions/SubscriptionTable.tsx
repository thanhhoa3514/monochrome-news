import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Undo } from "lucide-react";
import { Subscription } from '@/services/subscriptionService';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface SubscriptionTableProps {
    subscriptions: Subscription[];
    isLoading: boolean;
    onCancel: (id: number) => void;
    onActivate: (id: number) => void;
    isProcessing: boolean;
}

const SubscriptionTable = ({
    subscriptions,
    isLoading,
    onCancel,
    onActivate,
    isProcessing
}: SubscriptionTableProps) => {
    const [subscriptionToCancel, setSubscriptionToCancel] = useState<Subscription | null>(null);

    const getSubscriptionStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
            case 'cancelled':
                return <Badge className="bg-orange-600 hover:bg-orange-700">Cancelled</Badge>;
            case 'expired':
                return <Badge variant="outline" className="border-destructive text-destructive">Expired</Badge>;
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPlanTypeBadge = (planType?: string) => {
        switch (planType) {
            case 'free':
                return <Badge variant="outline">Free</Badge>;
            case 'basic':
                return <Badge className="bg-blue-600 hover:bg-blue-700">Basic</Badge>;
            case 'premium':
                return <Badge className="bg-purple-600 hover:bg-purple-700">Premium</Badge>;
            case 'enterprise':
                return <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Enterprise</Badge>;
            default:
                return <Badge variant="outline">{planType || 'Unknown'}</Badge>;
        }
    };

    const handleCancelClick = (subscription: Subscription) => {
        setSubscriptionToCancel(subscription);
    };

    const confirmCancel = () => {
        if (subscriptionToCancel) {
            onCancel(subscriptionToCancel.id);
            setSubscriptionToCancel(null);
        }
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Loading subscriptions...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : subscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    No subscriptions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            subscriptions.map((subscription) => (
                                <TableRow key={subscription.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{subscription.user?.name || 'Unknown User'}</span>
                                            <span className="text-xs text-muted-foreground">{subscription.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{subscription.plan?.name || 'Unknown Plan'}</TableCell>
                                    <TableCell>{getPlanTypeBadge(subscription.plan?.type)}</TableCell>
                                    <TableCell>{getSubscriptionStatusBadge(subscription.status)}</TableCell>
                                    <TableCell>
                                        <span className="font-medium">
                                            {subscription.plan?.currency} ${subscription.plan?.price.toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(subscription.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(subscription.end_date).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {subscription.status === 'active' ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleCancelClick(subscription)}
                                                disabled={isProcessing}
                                                className="h-8"
                                            >
                                                Cancel
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onActivate(subscription.id)}
                                                disabled={isProcessing}
                                                className="h-8 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                            >
                                                <Undo className="w-3 h-3 mr-1" />
                                                Reactivate
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDialog
                isOpen={!!subscriptionToCancel}
                onClose={() => setSubscriptionToCancel(null)}
                onConfirm={confirmCancel}
                title="Confirm Cancellation"
                description={
                    <>
                        Are you sure you want to cancel the subscription for <strong>{subscriptionToCancel?.user?.name}</strong>?
                        <br /><br />
                        This action will stop the auto-renewal and the user might lose access after the current period ends.
                    </>
                }
                confirmText="Yes, Cancel It"
                cancelText="Keep Subscription"
                variant="destructive"
            />
        </>
    );
};

export default SubscriptionTable;
