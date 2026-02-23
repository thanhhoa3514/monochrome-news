import React from 'react';
import AdminPermissionsClient from './AdminPermissionsClient';
import { serverPermissionService } from '@/lib/server';
import { Role, Permission } from '@/types/permissions';

export default async function AdminPermissions() {
  let roles: Role[] = [];
  let permissions: Permission[] = [];

  try {
    const [fetchedRoles, fetchedPermissions] = await Promise.all([
      serverPermissionService.getRoles(),
      serverPermissionService.getPermissions()
    ]);
    roles = fetchedRoles;
    permissions = fetchedPermissions;
  } catch (error) {
    console.error('Failed to fetch initial permissions data:', error);
  }

  return <AdminPermissionsClient initialRoles={roles} initialPermissionsData={permissions} />;
}
