import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
export const requireRole = (requiredRole) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError(ERROR_CODES.UNAUTHORIZED, "Authentication required", 401));
        }
        if (req.user.role !== requiredRole) {
            return next(new AppError(ERROR_CODES.FORBIDDEN, "You do not have permission to perform this action", 403));
        }
        return next();
    };
};
//# sourceMappingURL=authorization.middleware.js.map