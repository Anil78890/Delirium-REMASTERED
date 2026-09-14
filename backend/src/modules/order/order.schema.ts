import { z } from "zod";

export const createOrderSchema = z.object({});

export const updateOrderStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ]),
});

export const cancelOrderSchema = z.object({
    reason: z
        .string()
        .trim()
        .min(1)
        .max(500)
        .optional(),
});