import { prisma } from "../../config/prisma.js";
import type { PrismaClient } from "../../generated/prisma/client.js";

type WebhookDb = Pick<PrismaClient, "webhookEvent">;

export const webhookRepository = {
  findByProviderAndEventId(
    provider: string,
    eventId: string,
    db: WebhookDb = prisma,
  ) {
    return db.webhookEvent.findUnique({
      where: {
        provider_eventId: {
          provider,
          eventId,
        },
      },
    });
  },

  create(
    data: {
      provider: string;
      eventId: string;
      eventType: string;
      payload: object;
    },
    db: WebhookDb = prisma,
  ) {
    return db.webhookEvent.create({
      data: {
        provider: data.provider,
        eventId: data.eventId,
        eventType: data.eventType,
        payload: data.payload,
      },
    });
  },

  markProcessed(
    id: string,
    db: WebhookDb = prisma,
  ) {
    return db.webhookEvent.update({
      where: { id },
      data: {
        processedAt: new Date(),
      },
    });
  },
};