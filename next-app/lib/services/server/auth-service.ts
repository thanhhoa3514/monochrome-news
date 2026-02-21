import { serverApiClient } from "@/lib/server-api";
import type { AuthResponse } from "../../../../src/types/auth/auth";

export const serverAuthService = {
    async me() {
        try {
            // The serverApiClient will automatically attach the HttpOnly auth_token cookie
            // as a Bearer token in the Authorization header.
            const user = await serverApiClient.request<AuthResponse['user']>("/auth/me");
            return user;
        } catch (error) {
            return null;
        }
    },
};
