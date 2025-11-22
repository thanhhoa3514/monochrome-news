
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
  avatar?: string;
}

export const mockUserData: User[] = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '20 Mai 2025',
    joinDate: '10 Jan 2023',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Marie Laurent',
    email: 'marie.laurent@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: '19 Mai 2025',
    joinDate: '15 Mar 2023',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 3,
    name: 'Pierre Martin',
    email: 'pierre.martin@example.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '10 Mai 2025',
    joinDate: '05 Jun 2023',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 4,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: '18 Mai 2025',
    joinDate: '22 Jul 2023',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 5,
    name: 'Thomas Petit',
    email: 'thomas.petit@example.com',
    role: 'viewer',
    status: 'pending',
    lastLogin: 'Never',
    joinDate: '14 Mai 2025',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 6,
    name: 'Camille Moreau',
    email: 'camille.moreau@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '17 Mai 2025',
    joinDate: '30 Sep 2023',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    id: 7,
    name: 'Lucas Girard',
    email: 'lucas.girard@example.com',
    role: 'editor',
    status: 'inactive',
    lastLogin: '01 Mai 2025',
    joinDate: '12 Nov 2023',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    id: 8,
    name: 'Emma Leroy',
    email: 'emma.leroy@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '15 Mai 2025',
    joinDate: '08 Jan 2024',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
];
