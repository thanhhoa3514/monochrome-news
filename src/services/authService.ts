import { LoginCredentials, RegisterData, AuthResponse, VerifyOtpData } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const authService = {
    async register(data: RegisterData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        return result;
    },

    async verifyRegistration(data: VerifyOtpData) {
        const response = await fetch(`${API_BASE_URL}/auth/register/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Verification failed');
        }

        return result;
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ ...credentials, use_cookies: true }),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        return result;
    },

    async resendOtp(email: string) {
        const response = await fetch(`${API_BASE_URL}/otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email }),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to resend OTP');
        }

        return result;
    },

    async verifyOtp(email: string, otp: string) {
        const response = await fetch(`${API_BASE_URL}/otp/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Invalid OTP');
        }

        return result;
    },

    async me() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch user profile');
        }

        return result;
    }
};
