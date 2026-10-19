import type { PaymentAttemptStatus, PaymentStatus, PrismaClient } from "../../generated/prisma/client.js";
import type { CreatePaymentAttemptData, CreatePaymentData } from "./payment.types.js";
type PaymentDb = Pick<PrismaClient, "payment" | "paymentAttempt" | "$executeRaw">;
export declare const paymentRepository: {
    findPaymentByOrderId(orderId: string, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentClient<{
        id: string;
        orderId: string;
        amountInPaise: number;
        status: PaymentStatus;
        gateway: import("../../generated/prisma/enums.js").PaymentGateway;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createPaymentAttempt(data: CreatePaymentAttemptData, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentAttemptClient<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: PaymentAttemptStatus;
        gatewayOrderId: string | null;
        gatewayPaymentId: string | null;
        gatewaySignature: string | null;
        gatewayOrderCreatedAt: Date | null;
        gatewayOrderCreationToken: string | null;
        gatewayOrderCreationUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    updatePaymentAttemptGatewayOrderId(attemptId: string, gatewayOrderId: string, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findActiveAttemptByPaymentId(paymentId: string, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentAttemptClient<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: PaymentAttemptStatus;
        gatewayOrderId: string | null;
        gatewayPaymentId: string | null;
        gatewaySignature: string | null;
        gatewayOrderCreatedAt: Date | null;
        gatewayOrderCreationToken: string | null;
        gatewayOrderCreationUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createPayment(data: CreatePaymentData, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentClient<{
        id: string;
        orderId: string;
        amountInPaise: number;
        status: PaymentStatus;
        gateway: import("../../generated/prisma/enums.js").PaymentGateway;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    updatePaymentStatus(paymentId: string, currentStatus: PaymentStatus, newStatus: PaymentStatus, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    updatePaymentAttemptStatus(attemptId: string, currentStatus: PaymentAttemptStatus, newStatus: PaymentAttemptStatus, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findAttemptByGatewayOrderId(gatewayOrderId: string, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentAttemptClient<({
        payment: {
            id: string;
            orderId: string;
            amountInPaise: number;
            status: PaymentStatus;
            gateway: import("../../generated/prisma/enums.js").PaymentGateway;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: PaymentAttemptStatus;
        gatewayOrderId: string | null;
        gatewayPaymentId: string | null;
        gatewaySignature: string | null;
        gatewayOrderCreatedAt: Date | null;
        gatewayOrderCreationToken: string | null;
        gatewayOrderCreationUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    updatePaymentAttemptGatewayDetails(attemptId: string, gatewayPaymentId: string, gatewaySignature: string | undefined, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    claimGatewayOrderCreationLease(attemptId: string, token: string, leaseUntil: Date, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    finalizeGatewayOrderCreation(attemptId: string, creationToken: string, gatewayOrderId: string, gatewayOrderCreatedAt: Date, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    releaseGatewayOrderCreationLease(attemptId: string, creationToken: string, db?: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findAttemptById(attemptId: string, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentAttemptClient<({
        payment: {
            id: string;
            orderId: string;
            amountInPaise: number;
            status: PaymentStatus;
            gateway: import("../../generated/prisma/enums.js").PaymentGateway;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: PaymentAttemptStatus;
        gatewayOrderId: string | null;
        gatewayPaymentId: string | null;
        gatewaySignature: string | null;
        gatewayOrderCreatedAt: Date | null;
        gatewayOrderCreationToken: string | null;
        gatewayOrderCreationUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findSuccessfulAttemptByPaymentId(paymentId: string, db?: PaymentDb): import("../../generated/prisma/models.js").Prisma__PaymentAttemptClient<{
        id: string;
        paymentId: string;
        amountInPaise: number;
        status: PaymentAttemptStatus;
        gatewayOrderId: string | null;
        gatewayPaymentId: string | null;
        gatewaySignature: string | null;
        gatewayOrderCreatedAt: Date | null;
        gatewayOrderCreationToken: string | null;
        gatewayOrderCreationUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    acquireOrderLock(orderId: string, db: PaymentDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<number>;
};
export {};
//# sourceMappingURL=payment.repository.d.ts.map