
import { Permission, RoleDefinition, UserRole } from "@/types/permissions";

export const mockPermissions: Permission[] = [
  {
    id: 'create-article',
    name: 'Create Articles',
    description: 'Ability to create new articles',
    roles: ['admin', 'editor']
  },
  {
    id: 'edit-article',
    name: 'Edit Articles',
    description: 'Ability to edit existing articles',
    roles: ['admin', 'editor']
  },
  {
    id: 'delete-article',
    name: 'Delete Articles',
    description: 'Ability to delete articles',
    roles: ['admin']
  },
  {
    id: 'publish-article',
    name: 'Publish Articles',
    description: 'Ability to publish articles',
    roles: ['admin', 'editor']
  },
  {
    id: 'manage-users',
    name: 'Manage Users',
    description: 'Ability to create, edit, and delete users',
    roles: ['admin']
  },
  {
    id: 'manage-roles',
    name: 'Manage Roles',
    description: 'Ability to assign and modify user roles',
    roles: ['admin']
  },
  {
    id: 'view-statistics',
    name: 'View Statistics',
    description: 'Ability to view site statistics',
    roles: ['admin', 'editor', 'viewer']
  },
  {
    id: 'manage-settings',
    name: 'Manage Settings',
    description: 'Ability to change site settings',
    roles: ['admin']
  },
];

export const mockRoleDefinitions: RoleDefinition[] = [
  {
    name: 'admin',
    description: 'Full access to all system features',
    permissions: mockPermissions.map(p => p.id)
  },
  {
    name: 'editor',
    description: 'Can create and manage content but cannot manage users or system settings',
    permissions: ['create-article', 'edit-article', 'publish-article', 'view-statistics']
  },
  {
    name: 'viewer',
    description: 'Can only view statistics and published content',
    permissions: ['view-statistics']
  }
];

export const hasPermission = (role: UserRole, permissionId: string): boolean => {
  const permission = mockPermissions.find(p => p.id === permissionId);
  return permission ? permission.roles.includes(role) : false;
};

export const canUserPerformAction = (userId: number, permissionId: string): boolean => {
  // In a real app, this would check the specific user's role from a database
  // For now, we'll just assume user 1 is admin, 2-4 are editors, and the rest are viewers
  let role: UserRole = 'viewer';
  
  if (userId === 1) {
    role = 'admin';
  } else if (userId >= 2 && userId <= 4) {
    role = 'editor';
  }
  
  return hasPermission(role, permissionId);
};
