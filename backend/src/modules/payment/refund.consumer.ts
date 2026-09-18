import { logger } from "../../config/logger.js";
import { connectRabbitMQConsumer } from "../../config/rabbitmq.js";
import { RABBITMQ_QUEUES, RABBITMQ_ROUTING_KEYS } from "../../lib/rabbitmq.constants.js";
import { refundService } from "./refund.service.js";
import { RazorpayGateway } from "./razorpay.gateway.js";
import { refundRequestedEventSchema } from "./refund.schema.js";
import { classifyRabbitMQError } from "../../lib/rabbitmq-error-classifier.js";
import { moveToDlq, retryOrMoveToDlq } from "../../lib/rabbitmq.consumer-retry.js";


const PREFETCH_COUNT = 10;

const razorpayGateway = new RazorpayGateway();

export async function startRefundConsumer(): Promise<void> {
    const channel = await connectRabbitMQConsumer();

    channel.prefetch(PREFETCH_COUNT);

    await channel.consume(
        RABBITMQ_QUEUES.REFUND_PROCESSING,
        async (message) => {
            if (!message) return;

            try {
                // ------------------------------------------
                // 1. Parse message
                // ------------------------------------------

                const rawPayload = JSON.parse(
                    message.content.toString("utf-8"),
                );

                // ------------------------------------------
                // 2. Validate event
                // ------------------------------------------

                const parsed =
                    refundRequestedEventSchema.safeParse(
                        rawPayload,
                    );

                if (!parsed.success) {
                    logger.error(
                        {
                            error: parsed.error,
                        },
                        "Invalid refund requested event",
                    );

                    // Invalid message can never become valid
                    // by retrying it.
                    await moveToDlq(
                          channel,
                          message,
                          RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_DLQ,
                        );

                    return;
                }

                const event = parsed.data;

                logger.info(
                    {
                        refundId: event.refundId,
                        paymentId: event.paymentId,
                        orderId: event.orderId,
                        amountInPaise: event.amountInPaise,
                    },
                    "Refund requested event received",
                );

                // ------------------------------------------
                // 3. Process refund
                // ------------------------------------------

                const refund =
                    await refundService.processRefund(
                        event.refundId,
                        razorpayGateway,
                    );

                // ------------------------------------------
                // 4. Acknowledge
                // ------------------------------------------

                channel.ack(message);

                logger.info(
                    {
                        refundId: event.refundId,
                        status: refund?.status,
                    },
                    "Refund event processed",
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
        "Failed to process refund message",
    );

    if (errorType === "PERMANENT") {
        await moveToDlq(
            channel,
            message,
            RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_DLQ,
        );

        return;
    }

    await retryOrMoveToDlq(
        channel,
        message,
        {
            retryRoutingKeys: [
                RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_RETRY_5S,
                RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_RETRY_30S,
                RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_RETRY_120S,
            ],
            dlqRoutingKey:
                RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_DLQ,
        },
    );
}
        },
    );

    logger.info(
        {
            queue: RABBITMQ_QUEUES.REFUND_PROCESSING,
            prefetchCount: PREFETCH_COUNT,
        },
        "Refund consumer started",
    );
}