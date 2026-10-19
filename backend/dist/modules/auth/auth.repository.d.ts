type CreateGoogleUserData = {
    name: string;
    email: string;
    googleId: string;
};
type CreateSessionData = {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
};
type RotateSessionData = {
    sessionId: string;
    oldRefreshTokenHash: string;
    newRefreshTokenHash: string;
    expiresAt: Date;
};
export declare const authRepository: {
    findUserByEmail(email: string): import("../../generated/prisma/models.js").Prisma__UserClient<{
        id: string;
        email: string;
        googleId: string | null;
        name: string;
        role: import("../../generated/prisma/enums.js").UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findUserByGoogleId(googleId: string): import("../../generated/prisma/models.js").Prisma__UserClient<{
        id: string;
        email: string;
        googleId: string | null;
        name: string;
        role: import("../../generated/prisma/enums.js").UserRole;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createGoogleUser(data: CreateGoogleUserData): import("../../generated/prisma/models.js").Prisma__UserClient<{
        createdAt: Date;
        email: string;
        id: string;
        name: string;
        role: import("../../generated/prisma/enums.js").UserRole;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createSession(data: CreateSessionData): import("../../generated/prisma/models.js").Prisma__SessionClient<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findSessionById(sessionId: string): import("../../generated/prisma/models.js").Prisma__SessionClient<({
        user: {
            id: string;
            role: import("../../generated/prisma/enums.js").UserRole;
        };
    } & {
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    rotateSession(data: RotateSessionData): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    revokeSession(sessionId: string): import("../../generated/prisma/models.js").Prisma__SessionClient<{
        id: string;
        userId: string;
        refreshTokenHash: string;
        expiresAt: Date;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    revokeAllSessions(userId: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findUserById(userId: string): import("../../generated/prisma/models.js").Prisma__UserClient<{
        createdAt: Date;
        email: string;
        id: string;
        name: string;
        role: import("../../generated/prisma/enums.js").UserRole;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
};
export {};
//# sourceMappingURL=auth.repository.d.ts.map