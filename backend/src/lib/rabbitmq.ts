import amqp, {
    type Channel,
    type ConfirmChannel,
    type ChannelModel,
} from "amqplib";

import {
    RABBITMQ_EXCHANGES,
    RABBITMQ_QUEUES,
    RABBITMQ_ROUTING_KEYS,
} from "./rabbitmq.constants.js";

import { env } from "../config/env.js";
import { logger } from "./logger.js";

type RabbitMQRecoveryHandler = () => Promise<void>;

let recoveryHandler: RabbitMQRecoveryHandler | null = null;

export function registerRabbitMQRecoveryHandler(
    handler: RabbitMQRecoveryHandler,
): void {
    recoveryHandler = handler;
}


let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let isShuttingDown = false;

const INITIAL_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

let connection: ChannelModel | null = null;

let publisherChannel: ConfirmChannel | null = null;
let consumerChannel: Channel | null = null;


let isRecovering = false;


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

async function getConnection(): Promise<ChannelModel> {
    if (connection) {
        return connection;
    }

    connection = await amqp.connect(env.RABBITMQ_URL);

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

export async function connectRabbitMQConsumer(): Promise<Channel> {
    if (consumerChannel) {
        return consumerChannel;
    }

    const rabbitMQConnection = await getConnection();

    consumerChannel =
        await rabbitMQConnection.createChannel();

    consumerChannel.on("error", () => {
        consumerChannel = null;
    });

    consumerChannel.on("close", () => {
        consumerChannel = null;
    });

    return consumerChannel;
}

export async function setupRabbitMQTopology(
    channel: ConfirmChannel,
): Promise<void> {

    await channel.assertExchange(
        RABBITMQ_EXCHANGES.PAYMENT_EVENTS,
        "topic",
        {
            durable: true,
        },
    );


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
}