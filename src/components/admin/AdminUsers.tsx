import React, { useState } from 'react';
import { Search, Filter, UserRoundPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { mockUserData, User } from '@/data/mockUserData';

const AdminUsers = () => {
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [filtersOpen, setFiltersOpen] = useState(false);

    const filteredUsers = mockUserData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleEditUser = (userId: number) => {
        toast({
            title: "Edit User",
            description: `Edit user with ID: ${userId}`,
        });
    };

    const handleDeleteUser = (userId: number) => {
        toast({
            title: "Delete User",
            description: `User with ID: ${userId} would be deleted`,
            variant: "destructive"
        });
    };

    const handleToggleUserStatus = (user: User) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast({
            title: "Status Changed",
            description: `${user.name}'s status changed to ${newStatus}`,
        });
    };

    const getRoleBadge = (role: 'admin' | 'editor' | 'viewer') => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-primary text-primary-foreground">{role}</Badge>;
            case 'editor':
                return <Badge variant="outline" className="border-blue-500 text-blue-500">{role}</Badge>;
            case 'viewer':
                return <Badge variant="outline">{role}</Badge>;
        }
    };

    const getStatusBadge = (status: 'active' | 'inactive' | 'pending') => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-600">{status}</Badge>;
            case 'inactive':
                return <Badge variant="outline" className="border-destructive text-destructive">{status}</Badge>;
            case 'pending':
                return <Badge variant="outline" className="border-yellow-500 text-yellow-500">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-serif">User Management</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="pl-8 w-full"
                        />
                    </div>
                    <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="absolute mt-2 z-10 bg-card shadow-lg rounded-md p-4 border space-y-4 right-0">
                            <div className="space-y-2">
                                <Label htmlFor="role-filter">Role</Label>
                                <select
                                    id="role-filter"
                                    className="w-full border rounded p-2 bg-background"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status-filter">Status</Label>
                                <select
                                    id="status-filter"
                                    className="w-full border rounded p-2 bg-background"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <Button className="shrink-0 bg-primary text-primary-foreground">
                        <UserRoundPlus className="h-4 w-4 mr-1" /> New User
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleUserStatus(user)}
                                            >
                                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsers;
