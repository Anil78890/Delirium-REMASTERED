import { logger } from "../../lib/logger.js";
import { connectRabbitMQ } from "../../lib/rabbitmq.js";
import {
    RABBITMQ_EXCHANGES,
} from "../../lib/rabbitmq.constants.js";
import { outboxRepository } from "./outbox.repository.js";
import { getOutboxRoutingKey } from "./outbox.events.js";
import { serializeOutboxPayload } from "./outbox.message.js";
import { getRetryDelayMs, MAX_OUTBOX_ATTEMPTS } from "./outbox.retry.js";

const BATCH_SIZE = 10;
 const PROCESSING_TIMEOUT_MS = 60_000;

export async function publishOutboxEvents(): Promise<void> {
    const channel = await connectRabbitMQ();

    await outboxRepository.requeueFailedEvents();

   

await outboxRepository.requeueStaleProcessingEvents(
    PROCESSING_TIMEOUT_MS,
);

    const events = await outboxRepository.claimPendingEvents(
        BATCH_SIZE,
    );

    if (events.length === 0) {
        return;
    }

    logger.info(
        {
            count: events.length,
        },
        "Outbox events claimed for publishing",
    );

    for (const event of events) {
    try {
        const routingKey = getOutboxRoutingKey(
            event.eventType,
        );

        const message = serializeOutboxPayload(
            event.payload,
        );

        channel.publish(
            RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
            routingKey,
            message,
            {
                persistent: true,
                contentType: "application/json",
            },
        );

        await channel.waitForConfirms();

        const result = await outboxRepository.markPublished(
            event.id,
        );

        if (result.count !== 1) {
            logger.warn(
                {
                    eventId: event.id,
                },
                "Outbox event could not be marked as published",
            );
        }
    } catch (error) {
    if (event.attempts >= MAX_OUTBOX_ATTEMPTS) {
        const result =
    await outboxRepository.markPermanentlyFailed(
        event.id,
    );

if (result.count !== 1) {
    logger.warn(
        {
            eventId: event.id,
            attempts: event.attempts,
        },
        "Outbox event could not be marked as permanently failed",
    );

    continue;
}

logger.error(
    {
        err: error,
        eventId: event.id,
        attempts: event.attempts,
    },
    "Outbox event permanently failed after maximum attempts",
);

continue;
    }

    const retryDelayMs = getRetryDelayMs(
        event.attempts,
    );

    const availableAt = new Date(
        Date.now() + retryDelayMs,
    );

    await outboxRepository.markFailed(
        event.id,
        availableAt,
    );

    logger.error(
        {
            err: error,
            eventId: event.id,
            attempts: event.attempts,
            retryDelayMs,
            availableAt,
        },
        "Failed to publish outbox event; scheduled for retry",
    );
}
}
}