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

let connection: ChannelModel | null = null;

let publisherChannel: ConfirmChannel | null = null;
let consumerChannel: Channel | null = null;

async function getConnection(): Promise<ChannelModel> {
    if (connection) {
        return connection;
    }

    connection = await amqp.connect(env.RABBITMQ_URL);

    connection.on("error", () => {
        connection = null;
        publisherChannel = null;
        consumerChannel = null;
    });

    connection.on("close", () => {
        connection = null;
        publisherChannel = null;
        consumerChannel = null;
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