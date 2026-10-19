import { apiClient } from "../lib/api/client";
import type { User } from "../types/auth.types";

interface RefreshResponse {
    success: boolean;
    data: {
        accessToken: string;
    };
}

interface GetMeResponse {
    success: boolean;
    data: {
        user: User;
    };
}

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = apiClient
        .post<RefreshResponse>("/auth/refresh")
        .then((response) => {
            return response.data.data.accessToken;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}

export async function getMe(): Promise<User> {
    const response =
        await apiClient.get<GetMeResponse>("/auth/me");

    return response.data.data.user;
}

export async function logout(): Promise<void> {
    await apiClient.post("/auth/logout");
}