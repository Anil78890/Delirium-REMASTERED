import "dotenv/config";
import type { StringValue } from "ms";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z
        .coerce
        .number()
        .int()
        .positive()
        .default(3000),

    DATABASE_URL: z.string().min(1),

    RABBITMQ_URL: z.string().min(1),

    LOG_LEVEL: z
        .enum(["fatal", "error", "warn", "info", "debug", "trace"])
        .default("info"),

    JWT_ACCESS_TOKEN_SECRET: z.string().min(1),

    JWT_REFRESH_TOKEN_SECRET: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.string().url(),

    FRONTEND_URL: z.string().url(),

    
    RESTAURANT_LATITUDE: z.coerce.number().min(-90).max(90),

    RESTAURANT_LONGITUDE: z.coerce.number().min(-180).max(180),

    DELIVERY_RADIUS_KM: z.coerce.number().positive().default(5),


    JWT_ACCESS_TOKEN_EXPIRY: z
        .string()
        .min(1)
        .transform((value) => value as StringValue),

    JWT_REFRESH_TOKEN_EXPIRY: z
        .string()
        .min(1)
        .transform((value) => value as StringValue),

    RAZORPAY_KEY_ID: z.string().min(1),

    RAZORPAY_KEY_SECRET: z.string().min(1),

    RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environmental variables:");
    console.error(parsedEnv.error.format());

    process.exit(1);
}

export const env = parsedEnv.data;