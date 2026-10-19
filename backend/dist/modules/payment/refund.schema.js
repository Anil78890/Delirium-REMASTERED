import { z } from "zod";
export const refundRequestedEventSchema = z.object({
    refundId: z.string().uuid(),
    paymentId: z.string().uuid(),
    orderId: z.string().uuid(),
    amountInPaise: z.number().int().positive(),
});
//# sourceMappingURL=refund.schema.js.map