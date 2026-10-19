import { z } from "zod";
export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
});
export const paymentSuccessEventSchema = z.object({
    paymentId: z.string().min(1),
    paymentAttemptId: z.string().min(1),
    orderId: z.string().min(1),
    amountInPaise: z.number().int().positive(),
});
export const razorpayOrderPaidWebhookSchema = z.object({
    entity: z.literal("event"),
    account_id: z.string(),
    event: z.literal("order.paid"),
    contains: z.array(z.string()),
    payload: z.object({
        order: z.object({
            entity: z.object({
                id: z.string().min(1),
                amount: z.number().int().positive(),
                currency: z.string().min(1),
                status: z.string().min(1),
            }),
        }),
        payment: z.object({
            entity: z.object({
                id: z.string().min(1),
                order_id: z.string().min(1),
                amount: z.number().int().positive(),
                status: z.string().min(1),
            }),
        }),
    }),
});
//# sourceMappingURL=payment.schema.js.map