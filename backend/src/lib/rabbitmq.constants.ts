export const RABBITMQ_EXCHANGES = {

    PAYMENT_EVENTS: "payment.events",

} as const;


export const RABBITMQ_QUEUES = {

    ORDER_CONFIRMATION: "order.confirmation",
    REFUND_PROCESSING: "refund.processing",

} as const;


export const RABBITMQ_ROUTING_KEYS = {

    PAYMENT_SUCCESS: "payment.success",
    REFUND_REQUESTED: "refund.requested",

} as const;