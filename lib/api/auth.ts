import type { ApiClient } from "@/lib/api/types";
import type {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    AuthenticatedUserResponse,
    VerifyOtpData,
} from "@/types/auth/auth";

export function createAuthApi(client: ApiClient) {
    return {
        register: (data: RegisterData) =>
            client.request<AuthResponse>("/auth/register", { method: "POST", body: data }),

        verifyRegistration: (data: VerifyOtpData) =>
            client.request<AuthResponse>("/auth/register/verify", { method: "POST", body: data }),

        login: (credentials: LoginCredentials) =>
            client.request<AuthResponse>("/auth/login", {
                method: "POST",
                body: { ...credentials, use_cookies: true },
            }),

        resendOtp: (email: string) =>
            client.request<{ message: string }>("/otp/send", { method: "POST", body: { email } }),

        verifyOtp: (email: string, otp: string) =>
            client.request<{ message: string }>("/otp/verify", { method: "POST", body: { email, otp } }),

        me: () => client.request<AuthenticatedUserResponse>("/auth/me"),

        updateProfile: (data: FormData) =>
            client.request<{ user: AuthResponse["user"] }>("/auth/update-profile", {
                method: "POST",
                body: data,
            }),

        changePassword: (currentPassword: string, newPassword: string, newPasswordConfirmation: string) =>
            client.request<{ message: string }>("/auth/change-password", {
                method: "POST",
                body: {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: newPasswordConfirmation,
                },
            }),
    };
}
