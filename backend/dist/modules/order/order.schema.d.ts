import { z } from "zod";
export declare const createOrderSchema: z.ZodObject<{}, z.core.$strip>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        CONFIRMED: "CONFIRMED";
        DELIVERED: "DELIVERED";
        OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY";
        PENDING: "PENDING";
        PREPARING: "PREPARING";
        READY: "READY";
    }>;
}, z.core.$strip>;
export declare const cancelOrderSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=order.schema.d.ts.map