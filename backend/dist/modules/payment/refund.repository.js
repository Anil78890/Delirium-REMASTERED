import { prisma } from "../../config/prisma.js";
export const refundRepository = {
    findById(refundId, db = prisma) {
        return db.refund.findUnique({
            where: {
                id: refundId,
            },
        });
    },
    findByIdempotencyKey(idempotencyKey, db = prisma) {
        return db.refund.findUnique({
            where: {
                idempotencyKey,
            },
        });
    },
    findByPaymentId(paymentId, db = prisma) {
        return db.refund.findMany({
            where: {
                paymentId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    create(data, db = prisma) {
        return db.refund.create({
            data: {
                id: data.id,
                paymentId: data.paymentId,
                amountInPaise: data.amountInPaise,
                gatewayPaymentId: data.gatewayPaymentId,
                idempotencyKey: data.idempotencyKey,
                ...(data.reason !== undefined
                    ? { reason: data.reason }
                    : {}),
            },
        });
    },
    updateStatus(refundId, currentStatus, newStatus, db = prisma) {
        return db.refund.updateMany({
            where: {
                id: refundId,
                status: currentStatus,
            },
            data: {
                status: newStatus,
            },
        });
    },
    updateGatewayDetails(refundId, gatewayRefundId, db = prisma) {
        return db.refund.updateMany({
            where: {
                id: refundId,
                gatewayRefundId: null,
            },
            data: {
                gatewayRefundId,
            },
        });
    },
    findProcessingRefunds(db = prisma) {
        return db.refund.findMany({
            where: {
                status: "PROCESSING",
                gatewayRefundId: {
                    not: null,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    },
};
//# sourceMappingURL=refund.repository.js.map