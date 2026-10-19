export declare const RABBITMQ_EXCHANGES: {
    readonly PAYMENT_EVENTS: "payment.events";
    readonly PAYMENT_EVENTS_RETRY: "payment.events.retry";
    readonly PAYMENT_EVENTS_DLQ: "payment.events.dlq";
};
export declare const RABBITMQ_QUEUES: {
    readonly ORDER_CONFIRMATION: "order.confirmation";
    readonly REFUND_PROCESSING: "refund.processing";
    readonly ORDER_STATUS_REALTIME: "order.status.realtime";
    readonly ORDER_CONFIRMATION_RETRY_5S: "order.confirmation.retry.5s";
    readonly ORDER_CONFIRMATION_RETRY_30S: "order.confirmation.retry.30s";
    readonly ORDER_CONFIRMATION_RETRY_120S: "order.confirmation.retry.120s";
    readonly REFUND_PROCESSING_RETRY_5S: "refund.processing.retry.5s";
    readonly REFUND_PROCESSING_RETRY_30S: "refund.processing.retry.30s";
    readonly REFUND_PROCESSING_RETRY_120S: "refund.processing.retry.120s";
    readonly ORDER_CONFIRMATION_DLQ: "order.confirmation.dlq";
    readonly REFUND_PROCESSING_DLQ: "refund.processing.dlq";
};
export declare const RABBITMQ_ROUTING_KEYS: {
    readonly PAYMENT_SUCCESS: "payment.success";
    readonly REFUND_REQUESTED: "refund.requested";
    readonly ORDER_STATUS_CHANGED: "order.status.changed";
    readonly ORDER_CONFIRMATION_RETRY_5S: "order.confirmation.retry.5s";
    readonly ORDER_CONFIRMATION_RETRY_30S: "order.confirmation.retry.30s";
    readonly ORDER_CONFIRMATION_RETRY_120S: "order.confirmation.retry.120s";
    readonly REFUND_PROCESSING_RETRY_5S: "refund.processing.retry.5s";
    readonly REFUND_PROCESSING_RETRY_30S: "refund.processing.retry.30s";
    readonly REFUND_PROCESSING_RETRY_120S: "refund.processing.retry.120s";
    readonly ORDER_CONFIRMATION_DLQ: "order.confirmation.dlq";
    readonly REFUND_PROCESSING_DLQ: "refund.processing.dlq";
};
//# sourceMappingURL=rabbitmq.constants.d.ts.map