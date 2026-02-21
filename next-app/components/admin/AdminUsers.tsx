import React, { useState, useEffect } from 'react';
import { Search, Filter, UserRoundPlus, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { userService, UserListItem } from '@/services/userService';
import DeleteModal from '@/components/modals/DeleteModal';
import AddEditUserModal from '@/components/modals/AddEditUserModal';

const AdminUsers = () => {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);

    // Add/Edit Modal State
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserListItem | undefined>(undefined);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers(1, 100); // Fetch 100 for now to allow client-side filtering
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());

        // Filter out admins and editors as requested
        const isSubscriber = !user.roles.some(r => r.slug === 'admin' || r.slug === 'editor');

        // Note: Backend roles structure is array of objects, simple filter might need adjustment
        const matchesRole = roleFilter === 'all' || user.roles.some(r => r.slug === roleFilter);
        // Note: Backend user might not have status field yet, assuming active for now or check field
        const matchesStatus = statusFilter === 'all'; // || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus && isSubscriber;
    });

    const handleAddUser = () => {
        setUserToEdit(undefined);
        setIsAddEditModalOpen(true);
    };

    const handleEditUser = (user: UserListItem) => {
        setUserToEdit(user);
        setIsAddEditModalOpen(true);
    };

    const handleDeleteClick = (user: UserListItem) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await userService.deleteUser(userToDelete.id);
            toast({
                title: "User Deleted",
                description: `User "${userToDelete.name}" has been deleted successfully`,
            });
            fetchUsers();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive"
            });
        } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleToggleUserStatus = (user: UserListItem) => {
        // Implement status toggle logic
        toast({
            title: "Status Changed",
            description: `Status toggle not implemented yet`,
        });
    };

    const getRoleBadge = (roles: { name: string, slug: string }[]) => {
        return (
            <div className="flex gap-1">
                {roles.map(role => (
                    <Badge key={role.slug} variant="outline" className={role.slug === 'admin' ? 'bg-primary text-primary-foreground' : ''}>
                        {role.name}
                    </Badge>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

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
                                    <option value="viewer">Viewer</option>
                                </select>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <Button className="shrink-0 bg-primary text-primary-foreground" onClick={handleAddUser}>
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
                                <TableHead>Roles</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleBadge(user.roles)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteClick(user)}
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteUser}
                itemName={userToDelete?.name}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone and will remove all their data."
            />

            <AddEditUserModal
                isOpen={isAddEditModalOpen}
                onClose={() => setIsAddEditModalOpen(false)}
                onSuccess={() => {
                    fetchUsers();
                    setIsAddEditModalOpen(false);
                }}
                user={userToEdit}
            />
        </div>
    );
};

export default AdminUsers;
