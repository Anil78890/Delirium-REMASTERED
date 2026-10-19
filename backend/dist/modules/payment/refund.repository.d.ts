import type { PrismaClient } from "../../generated/prisma/client.js";
import type { RefundStatus } from "../../generated/prisma/client.js";
type RefundDb = Pick<PrismaClient, "refund" | "payment">;
export declare const refundRepository: {
    findById(refundId: string, db?: RefundDb): import("../../generated/prisma/models.js").Prisma__RefundClient<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findByIdempotencyKey(idempotencyKey: string, db?: RefundDb): import("../../generated/prisma/models.js").Prisma__RefundClient<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findByPaymentId(paymentId: string, db?: RefundDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    }[]>;
    create(data: {
        id: string;
        paymentId: string;
        amountInPaise: number;
        gatewayPaymentId: string;
        idempotencyKey: string;
        reason?: string;
    }, db?: RefundDb): import("../../generated/prisma/models.js").Prisma__RefundClient<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    updateStatus(refundId: string, currentStatus: RefundStatus, newStatus: RefundStatus, db?: RefundDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    updateGatewayDetails(refundId: string, gatewayRefundId: string, db?: RefundDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findProcessingRefunds(db?: RefundDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: RefundStatus;
        gatewayRefundId: string | null;
        gatewayPaymentId: string;
        reason: string | null;
        createdAt: Date;
        updatedAt: Date;
        idempotencyKey: string;
    }[]>;
};
export {};
//# sourceMappingURL=refund.repository.d.ts.map