import axios from "axios";

import { ApiError } from "./api-error";
import { getAccessToken } from "../auth/token-store";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const statusCode = error.response?.status ?? 0;
        const data = error.response?.data;

        let message = "Something went wrong";
        let code: string | undefined;

        if (
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "object" &&
            data.error !== null
        ) {
            if (
                "message" in data.error &&
                typeof data.error.message === "string"
            ) {
                message = data.error.message;
            }

            if (
                "code" in data.error &&
                typeof data.error.code === "string"
            ) {
                code = data.error.code;
            }
        }

        return Promise.reject(
            new ApiError(
                message,
                statusCode,
                data,
                code,
            ),
        );
    },
);


apiClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});