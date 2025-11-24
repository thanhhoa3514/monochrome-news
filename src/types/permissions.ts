


export interface Permission {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  permissions: Permission[];
  users_count?: number;
  created_at?: string;
  updated_at?: string;
}