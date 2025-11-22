
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

export interface RoleDefinition {
  name: UserRole;
  description: string;
  permissions: string[];
}
