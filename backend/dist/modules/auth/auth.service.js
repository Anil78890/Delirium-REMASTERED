import { randomUUID } from "node:crypto";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { generateAccessToken, generateRefreshToken, getTokenExpiration, verifyRefreshToken, } from "../../lib/jwt.js";
import { hashToken } from "../../lib/token.js";
import { authRepository } from "./auth.repository.js";
export const authService = {
    async googleLogin(input) {
        const existingGoogleUser = await authRepository.findUserByGoogleId(input.googleId);
        if (existingGoogleUser) {
            return this.createAuthenticatedSession(existingGoogleUser);
        }
        const user = await authRepository.createGoogleUser({
            name: input.name,
            email: input.email,
            googleId: input.googleId,
        });
        return this.createAuthenticatedSession(user);
    },
    async createAuthenticatedSession(user) {
        const sessionId = randomUUID();
        const accessToken = generateAccessToken({
            sub: user.id,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            sub: user.id,
            jti: sessionId,
        });
        const refreshTokenHash = hashToken(refreshToken);
        const expiresAt = getTokenExpiration(refreshToken);
        await authRepository.createSession({
            id: sessionId,
            userId: user.id,
            refreshTokenHash,
            expiresAt,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
            accessToken,
            refreshToken,
        };
    },
    async refresh(input) {
        let payload;
        try {
            payload = verifyRefreshToken(input.refreshToken);
        }
        catch {
            throw new AppError(ERROR_CODES.UNAUTHORIZED, "Invalid refresh token", 401);
        }
        const session = await authRepository.findSessionById(payload.jti);
        if (!session) {
            throw new AppError(ERROR_CODES.UNAUTHORIZED, "Invalid refresh token", 401);
        }
        if (session.revokedAt !== null) {
            throw new AppError(ERROR_CODES.UNAUTHORIZED, "Refresh token has been revoked", 401);
        }
        if (session.expiresAt <= new Date()) {
            throw new AppError(ERROR_CODES.UNAUTHORIZED, "Refresh session has expired", 401);
        }
        const oldRefreshTokenHash = hashToken(input.refreshToken);
        const newRefreshToken = generateRefreshToken({
            sub: session.userId,
            jti: session.id,
        });
        const newRefreshTokenHash = hashToken(newRefreshToken);
        const newExpiresAt = getTokenExpiration(newRefreshToken);
        const rotated = await authRepository.rotateSession({
            sessionId: session.id,
            oldRefreshTokenHash,
            newRefreshTokenHash,
            expiresAt: newExpiresAt,
        });
        if (rotated.count !== 1) {
            await authRepository.revokeSession(session.id);
            throw new AppError(ERROR_CODES.UNAUTHORIZED, "Refresh token reuse detected", 401);
        }
        const accessToken = generateAccessToken({
            sub: session.userId,
            role: session.user.role,
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    },
    async logout(input) {
        let payload;
        try {
            payload = verifyRefreshToken(input.refreshToken);
        }
        catch {
            return;
        }
        const session = await authRepository.findSessionById(payload.jti);
        if (!session) {
            return;
        }
        if (session.revokedAt !== null) {
            return;
        }
        const refreshTokenHash = hashToken(input.refreshToken);
        if (session.refreshTokenHash !== refreshTokenHash) {
            return;
        }
        await authRepository.revokeSession(session.id);
    },
    async logoutAll(userId) {
        await authRepository.revokeAllSessions(userId);
    },
    async getMe(userId) {
        const user = await authRepository.findUserById(userId);
        if (!user) {
            throw new AppError(ERROR_CODES.USER_NOT_FOUND, "User not found", 404);
        }
        return user;
    },
};
//# sourceMappingURL=auth.service.js.map