import React from 'react';
import AdminUsersClient from './AdminUsersClient';
import { serverUserService } from '@/lib/server';
import { serverPermissionService } from '@/lib/server';
import { UserListItem } from '@/types/user';
import { Role } from '@/types/permissions';

interface AdminUsersProps {
    searchParams?: {
        [key: string]: string | string[] | undefined;
    };
}

export default async function AdminUsers({ searchParams }: AdminUsersProps) {
    let initialUsers: UserListItem[] = [];
    let initialRoles: Role[] = [];
    let totalPages = 1;
    let currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
    const selectedRole = typeof searchParams?.role === 'string' ? searchParams.role : 'all';

    try {
        const queryRole = selectedRole !== 'all' ? selectedRole : undefined;
        const [usersRes, rolesRes] = await Promise.all([
            serverUserService.getUsers(currentPage, 10, queryRole),
            serverPermissionService.getRoles()
        ]);
        initialUsers = usersRes.data;
        totalPages = usersRes.last_page;
        currentPage = usersRes.current_page;
        initialRoles = rolesRes;
    } catch (error) {
        console.error('Failed to fetch initial data:', error);
    }

    return (
        <AdminUsersClient
            initialUsers={initialUsers}
            initialRoles={initialRoles}
            currentPage={currentPage}
            totalPages={totalPages}
            initialRole={selectedRole}
        />
    );
}
