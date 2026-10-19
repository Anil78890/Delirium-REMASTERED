import { z } from "zod";
export const orderStatusChangedEventSchema = z.object({
    orderId: z.string(),
    previousStatus: z.string(),
    newStatus: z.string(),
});
//# sourceMappingURL=realtime.schema.js.map