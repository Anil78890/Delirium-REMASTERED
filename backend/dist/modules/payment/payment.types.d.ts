import type { PaymentStatus, PaymentAttemptStatus, PaymentGateway } from "../../generated/prisma/client.js";
export interface CreatePaymentData {
    orderId: string;
    amountInPaise: number;
    gateway: PaymentGateway;
}
export interface CreatePaymentAttemptData {
    paymentId: string;
    amountInPaise: number;
}
export interface PaymentResult {
    paymentId: string;
    orderId: string;
    status: PaymentStatus;
}
export interface PaymentAttemptResult {
    attemptId: string;
    paymentId: string;
    status: PaymentAttemptStatus;
    gatewayOrderId: string;
}
export interface InitiatePaymentResult {
    paymentId: string;
    attemptId: string;
    orderId: string;
    amountInPaise: number;
    gatewayOrderId: string;
    currency: string;
}
export interface PaymentSuccessEvent {
    paymentId: string;
    paymentAttemptId: string;
    orderId: string;
    amountInPaise: number;
}
export type PaymentSuccessInput = {
    paymentId: string;
    paymentAttemptId: string;
    orderId: string;
    amountInPaise: number;
    gatewayPaymentId: string;
    gatewaySignature: string | undefined;
};
//# sourceMappingURL=payment.types.d.ts.map