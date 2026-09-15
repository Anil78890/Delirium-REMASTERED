import amqp, {
    type ChannelModel,
    type ConfirmChannel,
} from "amqplib";

import {
    RABBITMQ_EXCHANGES,
    RABBITMQ_QUEUES,
    RABBITMQ_ROUTING_KEYS,
} from "./rabbitmq.constants.js";

import { env } from "../config/env.js";
import { logger } from "./logger.js";


// ============================================================
// Types
// ============================================================

type RabbitMQRecoveryHandler = () => Promise<void>;


// ============================================================
// Recovery Handler
// ============================================================

let recoveryHandler: RabbitMQRecoveryHandler | null = null;

export function registerRabbitMQRecoveryHandler(
    handler: RabbitMQRecoveryHandler,
): void {
    recoveryHandler = handler;
}


// ============================================================
// Reconnection State
// ============================================================

let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let isShuttingDown = false;
let isRecovering = false;

const INITIAL_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;


// ============================================================
// RabbitMQ Resources
// ============================================================

let connection: ChannelModel | null = null;

let publisherChannel: ConfirmChannel | null = null;
let consumerChannel: ConfirmChannel | null = null;


// ============================================================
// Reconnection
// ============================================================

function scheduleReconnect(): void {
    if (isShuttingDown) {
        return;
    }

    if (reconnectTimer) {
        return;
    }

    const delay = Math.min(
        INITIAL_RECONNECT_DELAY_MS *
            2 ** reconnectAttempt,
        MAX_RECONNECT_DELAY_MS,
    );

    reconnectAttempt++;

    logger.warn(
        {
            delayMs: delay,
            attempt: reconnectAttempt,
        },
        "Scheduling RabbitMQ reconnect",
    );

    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;

        void reconnectRabbitMQ();
    }, delay);
}


async function reconnectRabbitMQ(): Promise<void> {
    if (isShuttingDown || isRecovering) {
        return;
    }

    isRecovering = true;

    try {
        const rabbitMQConnection = await getConnection();

        const newPublisherChannel =
            await rabbitMQConnection.createConfirmChannel();

        newPublisherChannel.on("error", () => {
            publisherChannel = null;
        });

        newPublisherChannel.on("close", () => {
            publisherChannel = null;
        });

        publisherChannel = newPublisherChannel;

        await setupRabbitMQTopology(
            newPublisherChannel,
        );

        reconnectAttempt = 0;

        logger.info(
            "RabbitMQ reconnected successfully",
        );

        if (recoveryHandler) {
            await recoveryHandler();
        }
    } catch (error) {
        logger.error(
            {
                err: error,
            },
            "RabbitMQ reconnect attempt failed",
        );

        connection = null;
        publisherChannel = null;
        consumerChannel = null;

        scheduleReconnect();
    } finally {
        isRecovering = false;
    }
}


// ============================================================
// Connection
// ============================================================

async function getConnection(): Promise<ChannelModel> {
    if (connection) {
        return connection;
    }

    connection = await amqp.connect(
        env.RABBITMQ_URL,
    );

    connection.on("error", (error) => {
        logger.error(
            {
                err: error,
            },
            "RabbitMQ connection error",
        );
    });

    connection.on("close", () => {
        connection = null;
        publisherChannel = null;
        consumerChannel = null;

        logger.warn(
            "RabbitMQ connection closed",
        );

        scheduleReconnect();
    });

    return connection;
}


// ============================================================
// Publisher Channel
// ============================================================

export async function connectRabbitMQ(): Promise<ConfirmChannel> {
    if (publisherChannel) {
        return publisherChannel;
    }

    const rabbitMQConnection = await getConnection();

    publisherChannel =
        await rabbitMQConnection.createConfirmChannel();

    publisherChannel.on("error", () => {
        publisherChannel = null;
    });

    publisherChannel.on("close", () => {
        publisherChannel = null;
    });

    return publisherChannel;
}


// ============================================================
// Consumer Channel
// ============================================================

export async function connectRabbitMQConsumer(): Promise<ConfirmChannel> {

    if(consumerChannel) {
        return consumerChannel;
    }

    const rabbitMQConnection = await getConnection();

    consumerChannel = await rabbitMQConnection.createConfirmChannel();

    consumerChannel.on("error", () => {
        consumerChannel = null;
    });

    consumerChannel.on("close", () => {
        consumerChannel = null;
    });

    return consumerChannel;
}


// ============================================================
// RabbitMQ Topology
// ============================================================

export async function setupRabbitMQTopology(
    channel: ConfirmChannel,
): Promise<void> {

    // --------------------------------------------------------
    // Exchange
    // --------------------------------------------------------

    await channel.assertExchange(
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
        "topic", // direct or topic or fanout -> choosed topic as per the requirement.
        {
            durable: true,
        },
    );

        await channel.assertExchange(
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        "direct",
        {
            durable: true,
        },
    );

    await channel.assertExchange(
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_DLQ,
        "direct",
        {
            durable: true,
        },
    );

    // --------------------------------------------------------
    // Order Confirmation Queue
    // --------------------------------------------------------

    await channel.assertQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION,
        {
            durable: true,
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
        RABBITMQ_ROUTING_KEYS.PAYMENT_SUCCESS,
    );

        await channel.assertQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_RETRY_5S,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 5_000,
                "x-dead-letter-exchange":
                    RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
                "x-dead-letter-routing-key":
                    RABBITMQ_ROUTING_KEYS.PAYMENT_SUCCESS,
            },
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_RETRY_5S,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_RETRY_5S,
    );


    await channel.assertQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_RETRY_30S,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 30_000,
                "x-dead-letter-exchange":
                    RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
                "x-dead-letter-routing-key":
                    RABBITMQ_ROUTING_KEYS.PAYMENT_SUCCESS,
            },
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_RETRY_30S,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_RETRY_30S,
    );


    await channel.assertQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_RETRY_120S,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 120_000,
                "x-dead-letter-exchange":
                    RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
                "x-dead-letter-routing-key":
                    RABBITMQ_ROUTING_KEYS.PAYMENT_SUCCESS,
            },
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_RETRY_120S,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_RETRY_120S,
    );


    await channel.assertQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_DLQ,
        {
            durable: true,
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.ORDER_CONFIRMATION_DLQ,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_DLQ,
        RABBITMQ_ROUTING_KEYS.ORDER_CONFIRMATION_DLQ,
    );


    // --------------------------------------------------------
    // Refund Processing Queue
    // --------------------------------------------------------

    await channel.assertQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING,
        {
            durable: true,
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
        RABBITMQ_ROUTING_KEYS.REFUND_REQUESTED,
    );


        await channel.assertQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_RETRY_5S,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 5_000,
                "x-dead-letter-exchange":
                    RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
                "x-dead-letter-routing-key":
                    RABBITMQ_ROUTING_KEYS.REFUND_REQUESTED,
            },
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_RETRY_5S,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_RETRY_5S,
    );


    await channel.assertQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_RETRY_30S,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 30_000,
                "x-dead-letter-exchange":
                    RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
                "x-dead-letter-routing-key":
                    RABBITMQ_ROUTING_KEYS.REFUND_REQUESTED,
            },
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_RETRY_30S,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_RETRY_30S,
    );


    await channel.assertQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_RETRY_120S,
        {
            durable: true,
            arguments: {
                "x-message-ttl": 120_000,
                "x-dead-letter-exchange":
                    RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
                "x-dead-letter-routing-key":
                    RABBITMQ_ROUTING_KEYS.REFUND_REQUESTED,
            },
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_RETRY_120S,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_RETRY,
        RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_RETRY_120S,
    );


    await channel.assertQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_DLQ,
        {
            durable: true,
        },
    );

    await channel.bindQueue(
        RABBITMQ_QUEUES.REFUND_PROCESSING_DLQ,
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS_DLQ,
        RABBITMQ_ROUTING_KEYS.REFUND_PROCESSING_DLQ,
    );
}