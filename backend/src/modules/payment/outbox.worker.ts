import { logger } from "../../config/logger.js";
import { publishOutboxEvents } from "./outbox.publisher.js";

const POLL_INTERVAL_MS = 1_000;

let workerRunning = false;

export async function startOutboxWorker(): Promise<void> {
    if (workerRunning) {
        return;
    }

    workerRunning = true;

    logger.info(
        "Outbox worker started",
    );

    while (workerRunning) {
        try {
            await publishOutboxEvents();
        } catch (error) {
            logger.error(
                {
                    err: error,
                },
                "Outbox worker cycle failed",
            );
        }

        await new Promise<void>((resolve) => {
            setTimeout(resolve, POLL_INTERVAL_MS);
        });
    }
}

export function stopOutboxWorker(): void {
    workerRunning = false;

    logger.info(
        "Outbox worker stopped",
    );
}