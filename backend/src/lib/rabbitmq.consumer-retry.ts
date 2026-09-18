import type { ConfirmChannel, ConsumeMessage } from "amqplib";

import {
    RABBITMQ_EXCHANGES,
    RABBITMQ_ROUTING_KEYS,
} from "./rabbitmq.constants.js";
import { logger } from "../config/logger.js";

type RetryConfig = {
    retryRoutingKeys: readonly string[];
    dlqRoutingKey: string;
};


export async function retryOrMoveToDlq(
    channel: ConfirmChannel,
    message: ConsumeMessage,
    config: RetryConfig,
): Promise<void> {

   const currentRetryCount = 
        Number(message.properties.headers?.["x-retry-count"] ?? 0);

   const nextRetryCount = currentRetryCount + 1;
   

   if(nextRetryCount > config.retryRoutingKeys.length) {

    logger.error(
    {
        messageId: message.properties.messageId,
        retryCount: currentRetryCount,
        originalRoutingKey:
            message.fields.routingKey,
        dlqRoutingKey: config.dlqRoutingKey,
    },
    "RabbitMQ message moved to DLQ",
);


       await channel.publish(
         RABBITMQ_EXCHANGES.PAYMENT_EVENTS_DLQ,
         config.dlqRoutingKey,
         message.content,
         {
            persistent: true,
            messageId: message.properties.messageId,
            contentType: message.properties.contentType,
            headers: {
                ...message.properties.headers,
                "x-retry-count": currentRetryCount,
            },
         },
       );


       await channel.waitForConfirms();

       channel.ack(message);

       return;
   }

   const retryRoutingKey = 
        config.retryRoutingKeys[nextRetryCount - 1];

    if(!retryRoutingKey) {
        throw new Error(
            `Missing retry routing key for retry count ${nextRetryCount}`,
        );
    }

    logger.warn(
    {
        messageId: message.properties.messageId,
        retryCount: nextRetryCount,
        retryRoutingKey,
        originalRoutingKey:
            message.fields.routingKey,
    },
    "RabbitMQ message scheduled for retry",
);

    channel.publish(
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        retryRoutingKey,
        message.content,
        {
            persistent: true,
            messageId: message.properties.messageId,
            contentType: message.properties.contentType,
            headers: {
                ...message.properties.headers,
                "x-retry-count": nextRetryCount,
            },
        },
    );


    await channel.waitForConfirms();

    channel.ack(message);
}

export async function moveToDlq(
    channel: ConfirmChannel,
    message: ConsumeMessage,
    dlqRoutingKey: string,
): Promise<void> {
    logger.error(
        {
            messageId: message.properties.messageId,
            originalRoutingKey: message.fields.routingKey,
            dlqRoutingKey,
        },
        "RabbitMQ message moved directly to DLQ",
    );

    channel.publish(
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_DLQ,
        dlqRoutingKey,
        message.content,
        {
            persistent: true,
            messageId: message.properties.messageId,
            contentType: message.properties.contentType,
            headers: {
                ...message.properties.headers,
                "x-retry-count": Number(
                    message.properties.headers?.["x-retry-count"] ?? 0,
                ),
            },
        },
    );

    await channel.waitForConfirms();

    channel.ack(message);
}