import { prisma } from "../../config/prisma.js";

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

export const authRepository = {
   
    findUserByGoogleId(googleId: string) {
        return prisma.user.findUnique({
            where: {
                googleId,
            },
        });
    },


    createGoogleUser(data: CreateGoogleUserData) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                googleId: data.googleId,
                role: "CUSTOMER",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
    },

    createSession(data: CreateSessionData) {
        return prisma.session.create({
            data,
        });
    },

    findSessionById(sessionId: string) {
        return prisma.session.findUnique({
            where: {
                id: sessionId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
            },
        });
    },

    rotateSession(data: RotateSessionData) {
        return prisma.session.updateMany({
            where: {
                id: data.sessionId,
                refreshTokenHash: data.oldRefreshTokenHash,
                revokedAt: null,
            },
            data: {
                refreshTokenHash: data.newRefreshTokenHash,
                expiresAt: data.expiresAt,
            },
        });
    },

    revokeSession(sessionId: string) {
        return prisma.session.update({
            where: {
                id: sessionId,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    },

    revokeAllSessions(userId: string) {
        return prisma.session.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    },

    findUserById(userId: string) {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
    },
};