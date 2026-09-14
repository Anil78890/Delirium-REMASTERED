import { logger } from "../../lib/logger.js";
import { connectRabbitMQConsumer } from "../../lib/rabbitmq.js";
import { RABBITMQ_QUEUES } from "../../lib/rabbitmq.constants.js";
import { refundService } from "./refund.service.js";
import { RazorpayGateway } from "./razorpay.gateway.js";
import { refundRequestedEventSchema } from "./refund.schema.js";

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
                    channel.nack(
                        message,
                        false,
                        false,
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
            } catch (error) {
                logger.error(
                    {
                        err: error,
                        messageId:
                            message.properties.messageId,
                    },
                    "Failed to process refund event",
                );

                // Technical failure:
                // retry the message.
                channel.nack(
                    message,
                    false,
                    true,
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