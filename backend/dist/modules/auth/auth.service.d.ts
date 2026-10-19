import type { RefreshTokenInput } from "./auth.schema.js";
type GoogleLoginInput = {
    googleId: string;
    email: string;
    name: string;
};
export declare const authService: {
    googleLogin(input: GoogleLoginInput): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: "ADMIN" | "CUSTOMER";
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    createAuthenticatedSession(user: {
        id: string;
        name: string;
        email: string;
        role: "CUSTOMER" | "ADMIN";
        createdAt: Date;
    }): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: "ADMIN" | "CUSTOMER";
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(input: RefreshTokenInput): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(input: RefreshTokenInput): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    getMe(userId: string): Promise<{
        createdAt: Date;
        email: string;
        id: string;
        name: string;
        role: import("../../generated/prisma/enums.js").UserRole;
    }>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map