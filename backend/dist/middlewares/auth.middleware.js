import { verifyAccessToken } from "../lib/jwt.js";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
export const requireAuth = (req, _res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return next(new AppError(ERROR_CODES.UNAUTHORIZED, "Authentication required", 401));
    }
    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
        return next(new AppError(ERROR_CODES.UNAUTHORIZED, "Invalid authorization header", 401));
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id: payload.sub,
            role: payload.role,
        };
        return next();
    }
    catch {
        return next(new AppError(ERROR_CODES.UNAUTHORIZED, "Invalid or expired access token", 401));
    }
};
//# sourceMappingURL=auth.middleware.js.map