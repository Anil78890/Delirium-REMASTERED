import type { PaymentSuccessInput } from "./payment.types.js";
export declare const paymentService: {
    initiatePayment(userId: string, orderId: string): Promise<{
        paymentId: string;
        attemptId: string;
        orderId: string;
        amountInPaise: number;
        gatewayOrderId: string;
        currency: string;
    }>;
    verifyPayment(userId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        paymentId: string;
        paymentAttemptId: string;
        orderId: string;
        status: "SUCCESS";
    }>;
    markPaymentSuccessful(input: PaymentSuccessInput): Promise<{
        paymentId: string;
        paymentAttemptId: string;
        orderId: string;
        status: "SUCCESS";
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map