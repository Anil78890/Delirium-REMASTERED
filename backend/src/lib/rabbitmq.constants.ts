export const RABBITMQ_EXCHANGES = {
    PAYMENT_EVENTS: "payment.events",

    PAYMENT_EVENTS_RETRY: "payment.events.retry",

    PAYMENT_EVENTS_DLQ: "payment.events.dlq",
} as const;


export const RABBITMQ_QUEUES = {
    ORDER_CONFIRMATION: "order.confirmation",
    REFUND_PROCESSING: "refund.processing",

    ORDER_CONFIRMATION_RETRY_5S:
        "order.confirmation.retry.5s",

    ORDER_CONFIRMATION_RETRY_30S:
        "order.confirmation.retry.30s",

    ORDER_CONFIRMATION_RETRY_120S:
        "order.confirmation.retry.120s",

    REFUND_PROCESSING_RETRY_5S:
        "refund.processing.retry.5s",

    REFUND_PROCESSING_RETRY_30S:
        "refund.processing.retry.30s",

    REFUND_PROCESSING_RETRY_120S:
        "refund.processing.retry.120s",

    ORDER_CONFIRMATION_DLQ:
        "order.confirmation.dlq",

    REFUND_PROCESSING_DLQ:
        "refund.processing.dlq",
} as const;


export const RABBITMQ_ROUTING_KEYS = {
    PAYMENT_SUCCESS: "payment.success",
    REFUND_REQUESTED: "refund.requested",

    ORDER_CONFIRMATION_RETRY_5S:
        "order.confirmation.retry.5s",

    ORDER_CONFIRMATION_RETRY_30S:
        "order.confirmation.retry.30s",

    ORDER_CONFIRMATION_RETRY_120S:
        "order.confirmation.retry.120s",

    REFUND_PROCESSING_RETRY_5S:
        "refund.processing.retry.5s",

    REFUND_PROCESSING_RETRY_30S:
        "refund.processing.retry.30s",

    REFUND_PROCESSING_RETRY_120S:
        "refund.processing.retry.120s",

    ORDER_CONFIRMATION_DLQ:
        "order.confirmation.dlq",

    REFUND_PROCESSING_DLQ:
        "refund.processing.dlq",
} as const;