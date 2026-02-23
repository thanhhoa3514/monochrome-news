import { Role } from "./permissions";

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role_ids?: number[];
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    role_ids?: number[];
}

export interface UserListItem {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

export interface PaginatedUserResponse {
    current_page: number;
    data: UserListItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
