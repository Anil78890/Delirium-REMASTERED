import { prisma } from "../../config/prisma.js";
export const webhookRepository = {
    findByProviderAndEventId(provider, eventId, db = prisma) {
        return db.webhookEvent.findUnique({
            where: {
                provider_eventId: {
                    provider,
                    eventId,
                },
            },
        });
    },
    create(data, db = prisma) {
        return db.webhookEvent.create({
            data: {
                provider: data.provider,
                eventId: data.eventId,
                eventType: data.eventType,
                payload: data.payload,
            },
        });
    },
    markProcessed(id, db = prisma) {
        return db.webhookEvent.update({
            where: { id },
            data: {
                processedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=webhook.repository.js.map