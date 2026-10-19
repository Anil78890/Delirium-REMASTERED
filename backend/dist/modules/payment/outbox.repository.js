import { prisma } from "../../config/prisma.js";
import { MAX_OUTBOX_ATTEMPTS } from "./outbox.retry.js";
export const outboxRepository = {
    createEvent(data, db = prisma) {
        return db.outboxEvent.create({
            data: {
                eventType: data.eventType,
                aggregateType: data.aggregateType,
                aggregateId: data.aggregateId,
                payload: data.payload,
            },
        });
    },
    async claimPendingEvents(limit, db = prisma) {
        return db.$queryRaw `
            UPDATE "OutboxEvent"
            SET
                "status" = 'PROCESSING',
                "attempts" = "attempts" + 1,
                "updatedAt" = NOW()
            WHERE "id" IN (
                SELECT "id"
                FROM "OutboxEvent"
                WHERE
                    "status" = 'PENDING'
                    AND "availableAt" <= NOW()
                    AND "attempts" < ${MAX_OUTBOX_ATTEMPTS}
                ORDER BY "createdAt"
                FOR UPDATE SKIP LOCKED
                LIMIT ${limit}
            )
            RETURNING
                "id",
                "eventType",
                "aggregateType",
                "aggregateId",
                "payload",
                "status",
                "attempts",
                "availableAt",
                "processedAt",
                "createdAt",
                "updatedAt"
        `;
    },
    markPublished(eventId, db = prisma) {
        return db.outboxEvent.updateMany({
            where: {
                id: eventId,
                status: "PROCESSING",
            },
            data: {
                status: "PUBLISHED",
                processedAt: new Date(),
            },
        });
    },
    markFailed(eventId, availableAt, db = prisma) {
        return db.outboxEvent.updateMany({
            where: {
                id: eventId,
                status: "PROCESSING",
            },
            data: {
                status: "FAILED",
                availableAt,
            },
        });
    },
    requeueFailedEvents(db = prisma) {
        return db.outboxEvent.updateMany({
            where: {
                status: "FAILED",
                attempts: {
                    lt: MAX_OUTBOX_ATTEMPTS,
                },
                availableAt: {
                    lte: new Date(),
                },
            },
            data: {
                status: "PENDING",
            },
        });
    },
    async requeueStaleProcessingEvents(processingTimeoutMs, db = prisma) {
        const staleBefore = new Date(Date.now() - processingTimeoutMs);
        // Events that still have retry attempts available
        const requeuedResult = await db.outboxEvent.updateMany({
            where: {
                status: "PROCESSING",
                attempts: {
                    lt: MAX_OUTBOX_ATTEMPTS,
                },
                updatedAt: {
                    lt: staleBefore,
                },
            },
            data: {
                status: "PENDING",
            },
        });
        // Events that have exhausted all attempts
        const permanentlyFailedResult = await db.outboxEvent.updateMany({
            where: {
                status: "PROCESSING",
                attempts: {
                    gte: MAX_OUTBOX_ATTEMPTS,
                },
                updatedAt: {
                    lt: staleBefore,
                },
            },
            data: {
                status: "FAILED",
            },
        });
        return {
            requeued: requeuedResult.count,
            permanentlyFailed: permanentlyFailedResult.count,
        };
    },
    markPermanentlyFailed(eventId, db = prisma) {
        return db.outboxEvent.updateMany({
            where: {
                id: eventId,
                status: "PROCESSING",
            },
            data: {
                status: "FAILED",
            },
        });
    },
};
//# sourceMappingURL=outbox.repository.js.map