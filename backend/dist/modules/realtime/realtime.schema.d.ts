import { z } from "zod";
export declare const orderStatusChangedEventSchema: z.ZodObject<{
    orderId: z.ZodString;
    previousStatus: z.ZodString;
    newStatus: z.ZodString;
}, z.core.$strip>;
export type OrderStatusChangedEvent = z.infer<typeof orderStatusChangedEventSchema>;
//# sourceMappingURL=realtime.schema.d.ts.map