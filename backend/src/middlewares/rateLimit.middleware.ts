import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 100, // 100 requests per IP per minute

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});