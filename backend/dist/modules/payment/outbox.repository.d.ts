import type { PrismaClient } from "../../generated/prisma/client.js";
type OutboxDb = Pick<PrismaClient, "outboxEvent">;
export interface CreateOutboxEventData {
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    payload: object;
}
export declare const outboxRepository: {
    createEvent(data: CreateOutboxEventData, db?: OutboxDb): import("../../generated/prisma/models.js").Prisma__OutboxEventClient<{
        id: string;
        eventType: string;
        aggregateType: string;
        aggregateId: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        status: import("../../generated/prisma/enums.js").OutboxEventStatus;
        attempts: number;
        availableAt: Date;
        processedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    claimPendingEvents(limit: number, db?: PrismaClient): Promise<{
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
    }[]>;
    markPublished(eventId: string, db?: OutboxDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    markFailed(eventId: string, availableAt: Date, db?: OutboxDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    requeueFailedEvents(db?: OutboxDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    requeueStaleProcessingEvents(processingTimeoutMs: number, db?: OutboxDb): Promise<{
        requeued: number;
        permanentlyFailed: number;
    }>;
    markPermanentlyFailed(eventId: string, db?: OutboxDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
};
export {};
//# sourceMappingURL=outbox.repository.d.ts.map