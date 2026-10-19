import type { PrismaClient } from "../../generated/prisma/client.js";
type WebhookDb = Pick<PrismaClient, "webhookEvent">;
export declare const webhookRepository: {
    findByProviderAndEventId(provider: string, eventId: string, db?: WebhookDb): import("../../generated/prisma/models.js").Prisma__WebhookEventClient<{
        id: string;
        provider: string;
        eventId: string;
        eventType: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        processedAt: Date | null;
        createdAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    create(data: {
        provider: string;
        eventId: string;
        eventType: string;
        payload: object;
    }, db?: WebhookDb): import("../../generated/prisma/models.js").Prisma__WebhookEventClient<{
        id: string;
        provider: string;
        eventId: string;
        eventType: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        processedAt: Date | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    markProcessed(id: string, db?: WebhookDb): import("../../generated/prisma/models.js").Prisma__WebhookEventClient<{
        id: string;
        provider: string;
        eventId: string;
        eventType: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        processedAt: Date | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
};
export {};
//# sourceMappingURL=webhook.repository.d.ts.map