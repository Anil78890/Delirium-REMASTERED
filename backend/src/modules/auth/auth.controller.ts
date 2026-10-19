import type { Request, Response } from "express";

import {
    refreshTokenSchema,
} from "./auth.schema.js";

import { authService } from "./auth.service.js";

import { googleOAuthClient } from "../../config/google.js";

import { env } from "../../config/env.js";

import crypto from "node:crypto";


export async function refresh(req: Request, res: Response) {
    const bodyRefreshToken =
        typeof req.body?.refreshToken === "string"
            ? req.body.refreshToken
            : undefined;

    const cookieRefreshToken =
        typeof req.cookies.refresh_token === "string"
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

export async function logout(
    req: Request,
    res: Response,
) {
    const cookieRefreshToken =
        typeof req.cookies.refresh_token === "string"
            ? req.cookies.refresh_token
            : undefined;

    if (cookieRefreshToken) {
        await authService.logout({
            refreshToken: cookieRefreshToken,
        });
    }

    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/v1/auth",
    });

    return res.status(204).send();
}


export async function logoutAll(
    req: Request,
    res: Response,
) {
    await authService.logoutAll(req.user!.id);

    return res.status(204).send();
}


export async function getMe(
    req: Request,
    res: Response,
) {
    const user = await authService.getMe(req.user!.id);

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

/**
 * Starts Google OAuth.
 */
export function googleLogin(
    req: Request,
    res: Response,
) {
    const state = crypto.randomBytes(32).toString("hex");

    const requestedReturnTo =
        typeof req.query.returnTo === "string"
            ? req.query.returnTo
            : "";

    // Accept only relative paths on our frontend.
    const returnTo =
        requestedReturnTo.startsWith("/") &&
        !requestedReturnTo.startsWith("//") &&
        !requestedReturnTo.includes("\\") &&
        !requestedReturnTo.includes("\r") &&
        !requestedReturnTo.includes("\n")
            ? requestedReturnTo
            : "/";

    res.cookie("google_oauth_state", state, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
    });

    res.cookie("google_oauth_return_to", returnTo, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
    });

    const authorizationUrl =
        googleOAuthClient.generateAuthUrl({
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
export async function googleCallback(
    req: Request,
    res: Response,
) {
    const { code, state } = req.query;

    const savedState = req.cookies.google_oauth_state;
    const savedReturnTo = req.cookies.google_oauth_return_to;

   res.clearCookie("google_oauth_state", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
});

   res.clearCookie("google_oauth_return_to", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
});
    /*
     * Validate OAuth state before doing anything with
     * the authorization code.
     */
    if (
        typeof code !== "string" ||
        typeof state !== "string" ||
        typeof savedState !== "string" ||
        state !== savedState
    ) {
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
  

    /*
     * Exchange Google's authorization code for tokens.
     */
    const { tokens } =
        await googleOAuthClient.getToken(code);

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
    const ticket =
        await googleOAuthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: env.GOOGLE_CLIENT_ID,
        });

    const payload = ticket.getPayload();

    if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        payload.email_verified !== true
    ) {
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
    /*
 * The service decides whether to:
 *
 * - login an existing Google user
 * - create a new customer
 * - create the application session
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

const returnTo =
    typeof savedReturnTo === "string" &&
    savedReturnTo.startsWith("/") &&
    !savedReturnTo.startsWith("//") &&
    !savedReturnTo.includes("\\")
        ? savedReturnTo
        : "/";

return res.redirect(
    `${env.FRONTEND_URL}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
);
}