import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { prisma } from "../../lib/prisma.js";
import type { PaymentGateway } from "./payment.gateway.js";
import { paymentRepository } from "./payment.repository.js";
import { refundRepository } from "./refund.repository.js";

export const refundService = {
    async processRefund(
        refundId: string,
        gateway: PaymentGateway,
    ) {
        // --------------------------------------------------
        // 1. Load refund
        // --------------------------------------------------

        let refund = await refundRepository.findById(refundId);

        if (!refund) {
            throw new AppError(
                ERROR_CODES.REFUND_NOT_FOUND,
                "Refund not found",
                404,
            );
        }

        // --------------------------------------------------
        // 2. SUCCESS is terminal
        // --------------------------------------------------

        if (refund.status === "SUCCESS") {
            return refund;
        }

        // --------------------------------------------------
        // 3. Claim PENDING → PROCESSING
        // --------------------------------------------------

        if (refund.status === "PENDING") {
            const claimResult =
                await refundRepository.updateStatus(
                    refund.id,
                    "PENDING",
                    "PROCESSING",
                );

            if (claimResult.count !== 1) {
                // Another worker changed the refund state.
                // Reload the latest state.
                refund = await refundRepository.findById(refund.id);

                if (!refund) {
                    throw new AppError(
                        ERROR_CODES.REFUND_NOT_FOUND,
                        "Refund not found",
                        404,
                    );
                }

                if (refund.status === "SUCCESS") {
                    return refund;
                }

                if (refund.status === "FAILED") {
                    return refund;
                }

                // If it is PROCESSING, continue with reconciliation.
            } else {
                // We successfully claimed it.
                refund = await refundRepository.findById(refund.id);

                if (!refund) {
                    throw new AppError(
                        ERROR_CODES.REFUND_NOT_FOUND,
                        "Refund not found",
                        404,
                    );
                }
            }
        }

        // --------------------------------------------------
        // 4. FAILED is terminal for now
        // --------------------------------------------------

        if (refund.status === "FAILED") {
            return refund;
        }

        // At this point the refund should be PROCESSING.
        if (refund.status !== "PROCESSING") {
            throw new Error(
                `Unexpected refund status: ${refund.status}`,
            );
        }

        try {
            // --------------------------------------------------
            // 5. Crash recovery:
            //    gatewayRefundId already exists
            // --------------------------------------------------

            if (refund.gatewayRefundId) {
                const gatewayRefund =
                    await gateway.fetchRefund(
                        refund.gatewayRefundId,
                    );

                this.validateGatewayRefund(
                    refund,
                    gatewayRefund,
                );

                return this.handleGatewayRefundStatus(
                    refund,
                    gatewayRefund.status,
                );
            }

            // --------------------------------------------------
            // 6. No gatewayRefundId:
            //    create/retry refund using same idempotency key
            // --------------------
            // ------------------------------

          
            const gatewayRefund =
                await gateway.createRefund({
                    gatewayPaymentId:
                        refund.gatewayPaymentId,
                    amountInPaise:
                        refund.amountInPaise,
                    idempotencyKey:
                        refund.idempotencyKey,
                    receipt: refund.id,
                });

            // Save gateway refund ID.
            await refundRepository.updateGatewayDetails(
                refund.id,
                gatewayRefund.gatewayRefundId,
            );

            // Validate gateway response.
            this.validateGatewayRefund(
                refund,
                gatewayRefund,
            );

            return this.handleGatewayRefundStatus(
                refund,
                gatewayRefund.status,
            );
        } catch (error) {
            /*
             * We don't know whether Razorpay received,
             * created, or processed the refund.
             *
             * Therefore:
             *
             * - Do NOT mark the refund FAILED.
             * - Do NOT swallow the error.
             * - Let RabbitMQ retry the message.
             *
             * If Razorpay already processed the refund,
             * the same idempotency key / gatewayRefundId
             * allows the next attempt to reconcile safely.
             */
            throw error;
        }
    },

    // --------------------------------------------------
    // Validate gateway refund
    // --------------------------------------------------

    validateGatewayRefund(
        refund: {
            gatewayPaymentId: string;
            amountInPaise: number;
        },
        gatewayRefund: {
            gatewayPaymentId: string;
            amountInPaise: number;
        },
    ) {
        if (
            gatewayRefund.gatewayPaymentId !==
            refund.gatewayPaymentId
        ) {
            throw new Error(
                "Gateway refund belongs to a different payment",
            );
        }

        if (
            gatewayRefund.amountInPaise !==
            refund.amountInPaise
        ) {
            throw new Error(
                "Gateway refund amount does not match local refund amount",
            );
        }
    },

    // --------------------------------------------------
    // Handle Razorpay refund state
    // --------------------------------------------------

    async handleGatewayRefundStatus(
        refund: {
            id: string;
            paymentId: string;
        },
        gatewayStatus: string,
    ) {
        // --------------------------------------------------
        // Razorpay: processed
        // Local: SUCCESS
        //
        // Also mark Payment as REFUNDED in the same
        // database transaction.
        // --------------------------------------------------

        if (gatewayStatus === "processed") {
            await prisma.$transaction(async (tx) => {
                const refundResult =
                    await refundRepository.updateStatus(
                        refund.id,
                        "PROCESSING",
                        "SUCCESS",
                        tx,
                    );

                if (refundResult.count !== 1) {
                    throw new Error(
                        "Refund could not be finalized",
                    );
                }

                const paymentResult =
                    await paymentRepository.updatePaymentStatus(
                        refund.paymentId,
                        "SUCCESS",
                        "REFUNDED",
                        tx,
                    );

                if (paymentResult.count !== 1) {
                    throw new Error(
                        "Payment could not be marked as refunded",
                    );
                }
            });

            return refundRepository.findById(refund.id);
        }

        // --------------------------------------------------
        // Razorpay: pending
        // Local: PROCESSING
        // --------------------------------------------------

        if (gatewayStatus === "pending") {
            return refundRepository.findById(refund.id);
        }

        // --------------------------------------------------
        // Razorpay: failed
        // Local: FAILED
        // --------------------------------------------------

        if (gatewayStatus === "failed") {
            await refundRepository.updateStatus(
                refund.id,
                "PROCESSING",
                "FAILED",
            );

            return refundRepository.findById(refund.id);
        }

        // --------------------------------------------------
        // Unknown gateway state
        // --------------------------------------------------

        throw new Error(
            `Unknown gateway refund status: ${gatewayStatus}`,
        );
    },



    async reconcileProcessingRefunds(
        gateway: PaymentGateway,
    ) {
        const refunds = await refundRepository.findProcessingRefunds();

        for (const refund of refunds) {
            if(!refund.gatewayRefundId) {
                continue;
            }

            try {
                const gatewayRefund = 
                     await gateway.fetchRefund(
                        refund.gatewayRefundId,
                     );

                this.validateGatewayRefund(
                    refund,
                    gatewayRefund,
                );

                await this.handleGatewayRefundStatus(
                    refund,
                    gatewayRefund.status,
                );
            } catch(error) {
                 // One refund failing should not stop
            // reconciliation of all other refunds.
            console.error(
                `Failed to reconcile refund ${refund.id}`,
                error,
            );
            }
        }
    }
};