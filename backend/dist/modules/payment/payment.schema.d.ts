import { z } from "zod";
export declare const verifyPaymentSchema: z.ZodObject<{
    razorpay_order_id: z.ZodString;
    razorpay_payment_id: z.ZodString;
    razorpay_signature: z.ZodString;
}, z.core.$strip>;
export declare const paymentSuccessEventSchema: z.ZodObject<{
    paymentId: z.ZodString;
    paymentAttemptId: z.ZodString;
    orderId: z.ZodString;
    amountInPaise: z.ZodNumber;
}, z.core.$strip>;
export declare const razorpayOrderPaidWebhookSchema: z.ZodObject<{
    entity: z.ZodLiteral<"event">;
    account_id: z.ZodString;
    event: z.ZodLiteral<"order.paid">;
    contains: z.ZodArray<z.ZodString>;
    payload: z.ZodObject<{
        order: z.ZodObject<{
            entity: z.ZodObject<{
                id: z.ZodString;
                amount: z.ZodNumber;
                currency: z.ZodString;
                status: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
        payment: z.ZodObject<{
            entity: z.ZodObject<{
                id: z.ZodString;
                order_id: z.ZodString;
                amount: z.ZodNumber;
                status: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=payment.schema.d.ts.map