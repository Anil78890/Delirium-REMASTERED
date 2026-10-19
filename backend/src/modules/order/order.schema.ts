import { z } from "zod";

export const createOrderSchema = z.object({
    phoneNumber: z.string().trim().min(10).max(15),
    deliveryAddress: z.string().trim().min(5).max(500),

    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
});

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