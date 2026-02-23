import React from 'react';
import AdminUsersClient from './AdminUsersClient';
import { serverUserService } from '@/lib/server';
import { serverPermissionService } from '@/lib/server';
import { UserListItem } from '@/types/user';
import { Role } from '@/types/permissions';

export default async function AdminUsers() {
    let initialUsers: UserListItem[] = [];
    let initialRoles: Role[] = [];

    try {
        const [usersRes, rolesRes] = await Promise.all([
            serverUserService.getUsers(1, 100),
            serverPermissionService.getRoles()
        ]);
        initialUsers = usersRes.data;
        initialRoles = rolesRes;
    } catch (error) {
        console.error('Failed to fetch initial data:', error);
    }

    return <AdminUsersClient initialUsers={initialUsers} initialRoles={initialRoles} />;
}
