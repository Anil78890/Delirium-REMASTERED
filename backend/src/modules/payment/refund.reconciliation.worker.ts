import { logger } from "../../config/logger.js";
import { RazorpayGateway } from "./razorpay.gateway.js";
import { refundService } from "./refund.service.js";

const RECONCILIATION_INTERVAL_MS = 60_000;

let workerRunning = false;

const razorpayGateway = new RazorpayGateway();

export async function startRefundReconciliationWorker(): Promise<void> {
    if (workerRunning) return;

    workerRunning = true;

    logger.info(
        "Refund reconciliation worker started",
    );

    while (workerRunning) {
        try {
            await refundService.reconcileProcessingRefunds(
                razorpayGateway,
            );
        } catch (error) {
            logger.error(
                { err: error },
                "Refund reconciliation cycle failed",
            );
        }

        await new Promise<void>((resolve) =>
            setTimeout(
                resolve,
                RECONCILIATION_INTERVAL_MS,
            ),
        );
    }
}

export function stopRefundReconciliationWorker(): void {
    workerRunning = false;

    logger.info(
        "Refund reconciliation worker stopped",
    );
}