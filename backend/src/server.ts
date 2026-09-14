import app from "./app.js";

import { env } from "./config/env.js";

import { logger } from "./lib/logger.js";
import {
    connectRabbitMQ,
    setupRabbitMQTopology,
    registerRabbitMQRecoveryHandler,
} from "./lib/rabbitmq.js";

import { startRefundConsumer } from "./modules/payment/refund.consumer.js";

import {
    startOutboxWorker,
    stopOutboxWorker,
} from "./modules/payment/outbox.worker.js";

import {
    startOrderConfirmationConsumer,
} from "./modules/order/order-confirmation.consumer.js";
import { startRefundReconciliationWorker } from "./modules/payment/refund.reconciliation.worker.js";

let server: ReturnType<typeof app.listen>;

const shutdown = (signal: string) => {
    logger.info(
        { signal },
        "Shutdown signal received",
    );

    stopOutboxWorker();

    server?.close(() => {
        logger.info("HTTP server closed");

        process.exit(0);
    });
};
process.on("SIGTERM", () => {
    shutdown("SIGTERM");
}); // // Commonly used by infrastructure to request termination.

process.on("SIGINT", () => {
    shutdown("SIGINT");
});//Usually generated when you press:
// // Ctrl + C
// // during production it is visible.

process.on("uncaughtException", (error) => {
    logger.fatal(
        { err: error },
        "Uncaught exception",
    );

    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    logger.fatal(
        { err: reason },
        "Unhandled promise rejection",
    );

    process.exit(1);
});

async function startServer() {
    try {
        const rabbitMQChannel = await connectRabbitMQ();

        await setupRabbitMQTopology(rabbitMQChannel);

        registerRabbitMQRecoveryHandler(
    async () => {
        await startOrderConfirmationConsumer();
        await startRefundConsumer();
    },
);

        await startOrderConfirmationConsumer();
        await startRefundConsumer();
        void startRefundReconciliationWorker();

        server = app.listen(env.PORT, () => {
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