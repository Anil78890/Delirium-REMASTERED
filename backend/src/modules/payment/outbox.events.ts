import { RABBITMQ_ROUTING_KEYS } from "../../lib/rabbitmq.constants.js";

export function getOutboxRoutingKey(
    eventType: string,
): string {
    switch (eventType) {

        case "PAYMENT_SUCCESS":
            return RABBITMQ_ROUTING_KEYS.PAYMENT_SUCCESS;

        case "REFUND_REQUESTED":
            return RABBITMQ_ROUTING_KEYS.REFUND_REQUESTED;


        case "ORDER_STATUS_CHANGED":
            return RABBITMQ_ROUTING_KEYS.ORDER_STATUS_CHANGED;    
        default:
            throw new Error(
                `Unsupported outbox event type: ${eventType}`,
            );
    }
}