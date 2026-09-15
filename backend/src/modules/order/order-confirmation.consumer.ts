import { logger } from "../../lib/logger.js";
import { connectRabbitMQConsumer } from "../../lib/rabbitmq.js";
import {
    RABBITMQ_QUEUES,
    RABBITMQ_ROUTING_KEYS,
} from "../../lib/rabbitmq.constants.js";
import { paymentSuccessEventSchema } from "../payment/payment.schema.js";
import { orderService } from "./order.service.js";
import { moveToDlq, retryOrMoveToDlq } from "../../lib/rabbitmq.consumer-retry.js";
import { classifyRabbitMQError } from "../../lib/rabbitmq-error-classifier.js";

const PREFETCH_COUNT = 10;

export async function startOrderConfirmationConsumer(): Promise<void> {
    const channel = await connectRabbitMQConsumer();

    channel.prefetch(PREFETCH_COUNT);

    await channel.consume(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION,
        async (message) => {
            if (!message) {
                return;
            }

            try {
                const rawPayload = JSON.parse(
                    message.content.toString("utf-8"),
                );

                const parsed =
                    paymentSuccessEventSchema.safeParse(
                        rawPayload,
                    );

                if (!parsed.success) {
                    logger.error(
                        {
                            error: parsed.error,
                        },
                        "Invalid payment success event",
                    );

                    await moveToDlq(
                        channel,
                        message,
                        RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_DLQ,
                    );

                    return;
                }

                const event = parsed.data;

                logger.info(
                    {
                        event,
                    },
                    "Payment success event received",
                );
                
               

                await orderService.confirmOrderAfterPayment(
                    event.orderId,
                );

                channel.ack(message);

                logger.info(
                    {
                        orderId: event.orderId,
                        paymentId: event.paymentId,
                    },
                    "Order confirmed after successful payment",
                );
            } 
            catch (error) {
    const errorType = classifyRabbitMQError(error);

    logger.error(
        {
            error,
            messageId: message.properties.messageId,
            errorType,
        },
        "Failed to process order confirmation message",
    );

    if (errorType === "PERMANENT") {
        await moveToDlq(
            channel,
            message,
            RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_DLQ,
        );

        return;
    }

    await retryOrMoveToDlq(
        channel,
        message,
        {
            retryRoutingKeys: [
                RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_RETRY_5S,
                RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_RETRY_30S,
                RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_RETRY_120S,
            ],
            dlqRoutingKey:
                RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_DLQ,
        },
    );
}
        },
    );

    logger.info(
        {
            prefetchCount: PREFETCH_COUNT,
        },
        "Order confirmation consumer started",
    );
}