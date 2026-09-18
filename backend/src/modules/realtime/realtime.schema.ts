import { z } from "zod";

export const orderStatusChangedEventSchema = z.object({
    orderId: z.string(),
    previousStatus: z.string(),
    newStatus: z.string(),
});

export type OrderStatusChangedEvent = z.infer<
    typeof orderStatusChangedEventSchema
>;