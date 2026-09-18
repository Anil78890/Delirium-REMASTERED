import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

import { logger } from "../config/logger.js";
import { requestContext } from "../config/requestContext.js";

export const requestIdMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const requestId = randomUUID();

    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);

    const requestLogger = logger.child({
        requestId,
    });

    requestContext.run(
        {
            requestId,
            logger: requestLogger,
        },
        () => {
            next();
        },
    );
};