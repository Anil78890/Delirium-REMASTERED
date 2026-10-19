import { prisma } from "../../config/prisma.js";
export const authRepository = {
    findUserByEmail(email) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    },
    findUserByGoogleId(googleId) {
        return prisma.user.findUnique({
            where: {
                googleId,
            },
        });
    },
    createGoogleUser(data) {
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
    createSession(data) {
        return prisma.session.create({
            data,
        });
    },
    findSessionById(sessionId) {
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
    rotateSession(data) {
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
    revokeSession(sessionId) {
        return prisma.session.update({
            where: {
                id: sessionId,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    },
    revokeAllSessions(userId) {
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
    findUserById(userId) {
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
//# sourceMappingURL=auth.repository.js.map