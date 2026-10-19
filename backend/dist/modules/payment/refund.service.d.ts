import type { PaymentGateway } from "./payment.gateway.js";
export declare const refundService: {
    processRefund(refundId: string, gateway: PaymentGateway): Promise<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: import("../../generated/prisma/enums.js").RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    } | null>;
    validateGatewayRefund(refund: {
        gatewayPaymentId: string;
        amountInPaise: number;
    }, gatewayRefund: {
        gatewayPaymentId: string;
        amountInPaise: number;
    }): void;
    handleGatewayRefundStatus(refund: {
        id: string;
        paymentId: string;
    }, gatewayStatus: string): Promise<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: import("../../generated/prisma/enums.js").RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    } | null>;
    reconcileProcessingRefunds(gateway: PaymentGateway): Promise<void>;
};
//# sourceMappingURL=refund.service.d.ts.map