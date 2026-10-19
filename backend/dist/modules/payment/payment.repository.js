import { prisma } from "../../config/prisma.js";
export const paymentRepository = {
    findPaymentByOrderId(orderId, db = prisma) {
        return db.payment.findUnique({
            where: {
                orderId,
            },
        });
    },
    createPaymentAttempt(data, db = prisma) {
        return db.paymentAttempt.create({
            data: {
                paymentId: data.paymentId,
                amountInPaise: data.amountInPaise,
            },
        });
    },
    updatePaymentAttemptGatewayOrderId(attemptId, gatewayOrderId, db = prisma) {
        return db.paymentAttempt.updateMany({
            where: {
                id: attemptId,
                gatewayOrderId: null,
            },
            data: {
                gatewayOrderId,
            },
        });
    },
    findActiveAttemptByPaymentId(paymentId, db = prisma) {
        return db.paymentAttempt.findFirst({
            where: {
                paymentId,
                status: "CREATED",
                gatewayOrderId: {
                    not: null,
                },
            },
        });
    },
    createPayment(data, db = prisma) {
        return db.payment.create({
            data: {
                orderId: data.orderId,
                amountInPaise: data.amountInPaise,
                gateway: data.gateway,
            },
        });
    },
    updatePaymentStatus(paymentId, currentStatus, newStatus, db = prisma) {
        return db.payment.updateMany({
            where: {
                id: paymentId,
                status: currentStatus,
            },
            data: {
                status: newStatus,
            },
        });
    },
    updatePaymentAttemptStatus(attemptId, currentStatus, newStatus, db = prisma) {
        return db.paymentAttempt.updateMany({
            where: {
                id: attemptId,
                status: currentStatus,
            },
            data: {
                status: newStatus,
            },
        });
    },
    findAttemptByGatewayOrderId(gatewayOrderId, db = prisma) {
        return db.paymentAttempt.findUnique({
            where: {
                gatewayOrderId,
            },
            include: {
                payment: true,
            },
        });
    },
    updatePaymentAttemptGatewayDetails(attemptId, gatewayPaymentId, gatewaySignature, db = prisma) {
        return db.paymentAttempt.updateMany({
            where: {
                id: attemptId,
                gatewayPaymentId: null,
            },
            data: {
                gatewayPaymentId,
                ...(gatewaySignature !== undefined
                    ? { gatewaySignature }
                    : {}),
            },
        });
    },
    claimGatewayOrderCreationLease(attemptId, token, leaseUntil, db = prisma) {
        return db.paymentAttempt.updateMany({
            where: {
                id: attemptId,
                gatewayOrderId: null,
                status: "CREATED",
                OR: [
                    { gatewayOrderCreationUntil: null },
                    { gatewayOrderCreationUntil: { lt: new Date() } },
                ],
            },
            data: {
                gatewayOrderCreationToken: token,
                gatewayOrderCreationUntil: leaseUntil,
            },
        });
    },
    finalizeGatewayOrderCreation(attemptId, creationToken, gatewayOrderId, gatewayOrderCreatedAt, db = prisma) {
        return db.paymentAttempt.updateMany({
            where: {
                id: attemptId,
                gatewayOrderId: null,
                gatewayOrderCreationToken: creationToken,
            },
            data: {
                gatewayOrderId,
                gatewayOrderCreatedAt,
                gatewayOrderCreationToken: null,
                gatewayOrderCreationUntil: null,
            },
        });
    },
    releaseGatewayOrderCreationLease(attemptId, creationToken, db = prisma) {
        return db.paymentAttempt.updateMany({
            where: {
                id: attemptId,
                gatewayOrderId: null,
                gatewayOrderCreationToken: creationToken,
            },
            data: {
                gatewayOrderCreationToken: null,
                gatewayOrderCreationUntil: null,
            },
        });
    },
    findAttemptById(attemptId, db = prisma) {
        return db.paymentAttempt.findUnique({
            where: {
                id: attemptId,
            },
            include: {
                payment: true,
            },
        });
    },
    findSuccessfulAttemptByPaymentId(paymentId, db = prisma) {
        return db.paymentAttempt.findFirst({
            where: {
                paymentId,
                status: "SUCCESS",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    acquireOrderLock(orderId, db) {
        return db.$executeRaw `
        SELECT pg_advisory_xact_lock(
            hashtextextended(${orderId}, 0)
        )
    `;
    },
};
//# sourceMappingURL=payment.repository.js.map