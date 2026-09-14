import { RABBITMQ_ROUTING_KEYS } from "../../lib/rabbitmq.constants.js";

export function getOutboxRoutingKey(
    eventType: string,
): string {
    switch (eventType) {

        case "PAYMENT_SUCCESS":
            return RABBITMQ_ROUTING_KEYS.PAYMENT_SUCCESS;

        case "REFUND_REQUESTED":
            return RABBITMQ_ROUTING_KEYS.REFUND_REQUESTED;

        default:
            throw new Error(
                `Unsupported outbox event type: ${eventType}`,
            );
    }
}