export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export interface Role {
    id: number;
    name: string;
    slug: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    use_cookies?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar?: string;
}

export interface VerifyOtpData {
    email: string;
    otp: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token?: string;
    token_type?: string;
    expires_in?: number;
}
