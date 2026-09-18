import type { Request, Response, NextFunction } from "express";

import { getRequestContext } from "../config/requestContext.js";
import { logger } from "../config/logger.js";

export const requestLoggerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const startTime = process.hrtime.bigint();

    res.on("finish", () => {
        const endTime = process.hrtime.bigint();

        const durationMs =
            Number(endTime - startTime) / 1_000_000;

        const context = getRequestContext();

        const requestLogger = context?.logger ?? logger;

        requestLogger.info(
            {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                durationMs: Number(durationMs.toFixed(2)),
            },
            "HTTP request completed",
        );
    });

    next();
};