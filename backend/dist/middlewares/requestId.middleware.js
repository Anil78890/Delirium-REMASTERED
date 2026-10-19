import { randomUUID } from "node:crypto";
import { logger } from "../config/logger.js";
import { requestContext } from "../config/requestContext.js";
export const requestIdMiddleware = (req, res, next) => {
    const requestId = randomUUID();
    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    const requestLogger = logger.child({
        requestId,
    });
    requestContext.run({
        requestId,
        logger: requestLogger,
    }, () => {
        next();
    });
};
//# sourceMappingURL=requestId.middleware.js.map