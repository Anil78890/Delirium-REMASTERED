import { prisma } from "../../config/prisma.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { MAX_OUTBOX_ATTEMPTS } from "./outbox.retry.js";

type OutboxDb = Pick<
    PrismaClient,
    "outboxEvent"
>;

export interface CreateOutboxEventData {
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    payload: object;
}

export const outboxRepository = {

    createEvent(
        data: CreateOutboxEventData,
        db: OutboxDb = prisma,
    ) {
        return db.outboxEvent.create({
            data: {
                eventType: data.eventType,
                aggregateType: data.aggregateType,
                aggregateId: data.aggregateId,
                payload: data.payload,
            },
        });
    },


    async claimPendingEvents(
        limit: number,
        db: PrismaClient = prisma,
    ) {
        return db.$queryRaw<
            Array<{
                id: string;
                eventType: string;
                aggregateType: string;
                aggregateId: string;
                payload: unknown;
                status: string;
                attempts: number;
                availableAt: Date;
                processedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            }>
        >`
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



    markPublished(
    eventId: string,
    db: OutboxDb = prisma,
) {
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


    markFailed(
    eventId: string,
    availableAt: Date,
    db: OutboxDb = prisma,
) {
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
   
     requeueFailedEvents(
    db: OutboxDb = prisma,
) {
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

async requeueStaleProcessingEvents(
    processingTimeoutMs: number,
    db: OutboxDb = prisma,
) {
    const staleBefore = new Date(
        Date.now() - processingTimeoutMs,
    );

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
    const permanentlyFailedResult =
        await db.outboxEvent.updateMany({
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
        permanentlyFailed:
            permanentlyFailedResult.count,
    };
},

markPermanentlyFailed(
    eventId: string,
    db: OutboxDb = prisma,
) {
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