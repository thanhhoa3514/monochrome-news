/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, UserRoundPlus, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { UserListItem } from '@/types/user';
import DeleteModal from '@/components/modals/DeleteModal';
import AddEditUserModal from '@/components/modals/AddEditUserModal';
import { Role } from '@/types/permissions';
import { deleteUserAction } from '@/actions/users';
import PaginationControl from '@/components/common/PaginationControl';

interface AdminUsersClientProps {
    initialUsers: UserListItem[];
    initialRoles: Role[];
    currentPage: number;
    totalPages: number;
    initialRole: string;
}

const AdminUsersClient = ({
    initialUsers,
    initialRoles,
    currentPage,
    totalPages,
    initialRole,
}: AdminUsersClientProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [users, setUsers] = useState<UserListItem[]>(initialUsers);
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>(initialRole);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);

    // Add/Edit Modal State
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserListItem | undefined>(undefined);

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    useEffect(() => {
        setRoleFilter(initialRole);
    }, [initialRole]);

    const refreshUsers = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    const updateQuery = (nextRole: string, nextPage: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (nextRole !== 'all') {
            params.set('role', nextRole);
        } else {
            params.delete('role');
        }

        if (nextPage > 1) {
            params.set('page', nextPage.toString());
        } else {
            params.delete('page');
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const handleRoleChange = (nextRole: string) => {
        setRoleFilter(nextRole);
        updateQuery(nextRole, 1);
    };

    const handlePageChange = (page: number) => {
        updateQuery(roleFilter, page);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());

        // Note: Backend user might not have status field yet, assuming active for now or check field
        const matchesStatus = statusFilter === 'all'; // || user.status === statusFilter;

        return matchesSearch && matchesStatus;
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

        const deletingUser = userToDelete;

        startTransition(async () => {
            const result = await deleteUserAction(deletingUser.id);
            if (result.success) {
                const nextUsers = users.filter((user) => user.id !== deletingUser.id);
                setUsers(nextUsers);
                toast({
                    title: "User Deleted",
                    description: `User "${deletingUser.name}" has been deleted successfully`,
                });
                if (nextUsers.length === 0 && currentPage > 1) {
                    updateQuery(roleFilter, currentPage - 1);
                } else {
                    router.refresh();
                }
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete user",
                    variant: "destructive"
                });
            }
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        });
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
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                >
                                    <option value="all">All Roles</option>
                                    {initialRoles.map((role) => (
                                        <option key={role.id} value={role.slug}>
                                            {role.name}
                                        </option>
                                    ))}
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
                            {isPending && users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No users found for the current filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <div className="text-center text-xs text-muted-foreground">
                Showing {filteredUsers.length} results on page {currentPage} of {totalPages}
            </div>

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
                    refreshUsers();
                    setIsAddEditModalOpen(false);
                }}
                user={userToEdit}
                roles={initialRoles}
            />
        </div>
    );
};

export default AdminUsersClient;
