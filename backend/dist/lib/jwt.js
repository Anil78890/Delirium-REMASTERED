import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
const accessTokenPayloadSchema = z.object({
    sub: z.string(),
    role: z.enum(["CUSTOMER", "ADMIN"]),
});
const refreshTokenPayloadSchema = z.object({
    sub: z.string(),
    jti: z.string(),
});
export function generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY,
        algorithm: "HS256",
    });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY,
        algorithm: "HS256",
    });
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET, {
        algorithms: ["HS256"],
    });
    return accessTokenPayloadSchema.parse(decoded);
}
export function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET, {
        algorithms: ["HS256"],
    });
    return refreshTokenPayloadSchema.parse(decoded);
}
export function getTokenExpiration(token) {
    const decoded = jwt.decode(token);
    if (typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.exp !== "number") {
        throw new Error("Invalid JWT expiration");
    }
    return new Date(decoded.exp * 1000);
}
//# sourceMappingURL=jwt.js.map