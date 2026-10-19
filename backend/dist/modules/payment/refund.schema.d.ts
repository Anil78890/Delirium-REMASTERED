import { z } from "zod";
export declare const refundRequestedEventSchema: z.ZodObject<{
    refundId: z.ZodString;
    paymentId: z.ZodString;
    orderId: z.ZodString;
    amountInPaise: z.ZodNumber;
}, z.core.$strip>;
export type RefundRequestedEvent = z.infer<typeof refundRequestedEventSchema>;
//# sourceMappingURL=refund.schema.d.ts.map