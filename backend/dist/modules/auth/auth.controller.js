import { refreshTokenSchema, } from "./auth.schema.js";
import { authService } from "./auth.service.js";
import { googleOAuthClient } from "../../config/google.js";
import { env } from "../../config/env.js";
import crypto from "node:crypto";
export async function refresh(req, res) {
    const bodyRefreshToken = typeof req.body?.refreshToken === "string"
        ? req.body.refreshToken
        : undefined;
    const cookieRefreshToken = typeof req.cookies.refresh_token === "string"
        ? req.cookies.refresh_token
        : undefined;
    const refreshToken = bodyRefreshToken ?? cookieRefreshToken;
    const usedCookie = !bodyRefreshToken && !!cookieRefreshToken;
    const input = refreshTokenSchema.parse({
        refreshToken,
    });
    const result = await authService.refresh(input);
    if (usedCookie) {
        res.cookie("refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/api/v1/auth",
        });
    }
    return res.status(200).json({
        success: true,
        data: {
            accessToken: result.accessToken,
            // Don't expose the rotated refresh token to JavaScript
            // when authentication is using the HttpOnly cookie.
            ...(usedCookie
                ? {}
                : { refreshToken: result.refreshToken }),
        },
    });
}
export async function logout(req, res) {
    const input = refreshTokenSchema.parse(req.body);
    await authService.logout(input);
    return res.status(204).send();
}
export async function logoutAll(req, res) {
    await authService.logoutAll(req.user.id);
    return res.status(204).send();
}
export async function getMe(req, res) {
    const user = await authService.getMe(req.user.id);
    return res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
}
/**
 * Starts Google OAuth.
 */
export function googleLogin(req, res) {
    const state = crypto.randomBytes(32).toString("hex");
    res.cookie("google_oauth_state", state, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
    });
    const authorizationUrl = googleOAuthClient.generateAuthUrl({
        access_type: "online",
        scope: [
            "openid",
            "email",
            "profile",
        ],
        prompt: "select_account",
        state,
    });
    return res.redirect(authorizationUrl);
}
/**
 * Handles Google's OAuth callback.
 */
export async function googleCallback(req, res) {
    const { code, state } = req.query;
    const savedState = req.cookies.google_oauth_state;
    /*
     * Validate OAuth state before doing anything with
     * the authorization code.
     */
    if (typeof code !== "string" ||
        typeof state !== "string" ||
        typeof savedState !== "string" ||
        state !== savedState) {
        return res.status(400).json({
            success: false,
            error: {
                code: "INVALID_GOOGLE_OAUTH_STATE",
                message: "Invalid Google authentication request",
            },
        });
    }
    /*
     * State is one-time-use.
     */
    res.clearCookie("google_oauth_state");
    /*
     * Exchange Google's authorization code for tokens.
     */
    const { tokens } = await googleOAuthClient.getToken(code);
    if (!tokens.id_token) {
        return res.status(401).json({
            success: false,
            error: {
                code: "GOOGLE_ID_TOKEN_MISSING",
                message: "Google authentication failed",
            },
        });
    }
    /*
     * Verify the ID token cryptographically and make sure
     * it was issued for our Google OAuth client.
     */
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload ||
        !payload.sub ||
        !payload.email ||
        payload.email_verified !== true) {
        return res.status(401).json({
            success: false,
            error: {
                code: "INVALID_GOOGLE_IDENTITY",
                message: "Could not verify Google identity",
            },
        });
    }
    /*
     * Google has authenticated the user.
     *
     * From this point onward, the controller should NOT
     * contain application business logic.
     *
     * The service decides whether to:
     *
     * - login an existing Google user
     * - reject an email collision
     * - create a new customer
     * - create the Delirium session
     */
    const result = await authService.googleLogin({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name ?? payload.email,
    });
    res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api/v1/auth",
    });
    return res.redirect(`${env.FRONTEND_URL}/`);
}
//# sourceMappingURL=auth.controller.js.map