import { createServer } from "node:http";

import app from "./app.js";
import { env } from "./config/env.js";

import { startRefundConsumer } from "./modules/payment/refund.consumer.js";
import {
    startOutboxWorker,
    stopOutboxWorker,
} from "./modules/payment/outbox.worker.js";
import {
    startOrderConfirmationConsumer,
} from "./modules/order/order-confirmation.consumer.js";
import { startRefundReconciliationWorker } from "./modules/payment/refund.reconciliation.worker.js";
import { createRealtimeServer } from "./modules/realtime/realtime.server.js";
import { logger } from "./config/logger.js";
import { connectRabbitMQ, registerRabbitMQRecoveryHandler, setupRabbitMQTopology } from "./config/rabbitmq.js";
import { startOrderRealtimeConsumer } from "./modules/order/order-realtime.consumer.js";

let server: ReturnType<typeof createServer>;

const shutdown = (signal: string) => {
    logger.info({ signal }, "Shutdown signal received");

    stopOutboxWorker();

    server?.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

async function startServer() {
    try {
        const httpServer = createServer(app);

        const io = createRealtimeServer(httpServer);

        const rabbitMQChannel = await connectRabbitMQ();
        await setupRabbitMQTopology(rabbitMQChannel);

        registerRabbitMQRecoveryHandler(
            async () => {
                await startOrderConfirmationConsumer();
                await startRefundConsumer();
                await startOrderRealtimeConsumer(io);
            },
        );

        await startOrderConfirmationConsumer();
        await startRefundConsumer();
        await startOrderRealtimeConsumer(io);

        void startRefundReconciliationWorker();

        server = httpServer.listen(env.PORT, () => {
            logger.info(
                {
                    port: env.PORT,
                    environment: env.NODE_ENV,
                },
                "Server started",
            );

            void startOutboxWorker();
        });
    } catch (error) {
        logger.fatal(
            { err: error },
            "Failed to start server",
        );

        process.exit(1);
    }
}

startServer();
