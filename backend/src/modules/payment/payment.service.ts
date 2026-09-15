import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { prisma } from "../../lib/prisma.js";
import { orderRepository } from "../order/order.repository.js"
import { outboxRepository } from "./outbox.repository.js";
import { paymentRepository } from "./payment.repository.js";
import { RazorpayGateway } from "./razorpay.gateway.js";
import type { PaymentSuccessInput } from "./payment.types.js";

const paymentGateway = new RazorpayGateway();





export const paymentService = {


    

    async initiatePayment(
    userId: string,
    orderId: string,
) {
    const order = await orderRepository.findOrderById(orderId);

    if (!order) {
        throw new AppError(
            ERROR_CODES.ORDER_NOT_FOUND,
            "Order not found",
            404,
        );
    }

    if (order.userId !== userId) {
        throw new AppError(
            ERROR_CODES.FORBIDDEN,
            "You do not have permission to pay for this order",
            403,
        );
    }

    if (order.status !== "PENDING") {
        throw new AppError(
            ERROR_CODES.CONFLICT,
            `Order cannot be paid because its status is ${order.status}`,
            409,
        );
    }

    const { payment, attempt } = await prisma.$transaction(async (tx) => {
        // Lock this order so concurrent payment-initiation
        // requests cannot create duplicate local records.
        await paymentRepository.acquirePaymentInitiationLock(
            order.id,
            tx,
        );

        // ------------------------------------------------------------
        // 1. Get or create Payment
        // ------------------------------------------------------------

        let payment = await paymentRepository.findPaymentByOrderId(
            order.id,
            tx,
        );

        if (payment?.status === "SUCCESS") {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Order has already been paid",
                409,
            );
        }

        if (!payment) {
            payment = await paymentRepository.createPayment(
                {
                    orderId: order.id,
                    amountInPaise: order.totalInPaise,
                    gateway: "RAZORPAY",
                },
                tx,
            );
        }

        // ------------------------------------------------------------
        // 2. Get or create active PaymentAttempt
        // ------------------------------------------------------------

        let attempt =
            await paymentRepository.findActiveAttemptByPaymentId(
                payment.id,
                tx,
            );

        if (!attempt) {
            attempt = await paymentRepository.createPaymentAttempt(
                {
                    paymentId: payment.id,
                    amountInPaise: payment.amountInPaise,
                },
                tx,
            );
        }

        return {
            payment,
            attempt,
        };
    });

    // ------------------------------------------------------------
    // 3. Create Razorpay order
    // ------------------------------------------------------------

    if (attempt.gatewayOrderId) {
    return {
        paymentId: payment.id,
        attemptId: attempt.id,
        orderId: order.id,
        amountInPaise: payment.amountInPaise,
        gatewayOrderId: attempt.gatewayOrderId,
        currency: "INR",
    };
}

const gatewayOrder = await paymentGateway.createOrder({
    amountInPaise: attempt.amountInPaise,
    receipt: `delirium_attempt_${attempt.id}`,
});

const result =
    await paymentRepository.updatePaymentAttemptGatewayOrderId(
        attempt.id,
        gatewayOrder.gatewayOrderId,
    );

if (result.count !== 1) {
    throw new AppError(
        ERROR_CODES.CONFLICT,
        "Payment attempt was already associated with a gateway order",
        409,
    );
}

return {
    paymentId: payment.id,
    attemptId: attempt.id,
    orderId: order.id,
    amountInPaise: payment.amountInPaise,
    gatewayOrderId: gatewayOrder.gatewayOrderId,
    currency: gatewayOrder.currency,
};
},

    async verifyPayment(
        userId: string,
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
    ) {
        
        const attempt = 
        await paymentRepository.findAttemptByGatewayOrderId(
            razorpayOrderId,
        );


        if(!attempt) {
            throw new AppError(
            ERROR_CODES.PAYMENT_ATTEMPT_NOT_FOUND,
            "Payment attempt not found",
            404,
        );
        }

        const order = await orderRepository.findOrderById(
            attempt.payment.orderId,
        );

         if (!order) {
        throw new AppError(
            ERROR_CODES.ORDER_NOT_FOUND,
            "Order not found",
            404,
        );
    }

     
         if (order.userId !== userId) {
        throw new AppError(
            ERROR_CODES.FORBIDDEN,
            "You do not have permission to verify this payment",
            403,
        );
    }   



        const isValidSignature =
        paymentGateway.verifyPaymentSignature({
            gatewayOrderId: razorpayOrderId,
            gatewayPaymentId: razorpayPaymentId,
            gatewaySignature: razorpaySignature,
        });

    if (!isValidSignature) {
        throw new AppError(
            ERROR_CODES.VALIDATION_ERROR,
            "Invalid payment signature",
            400,
        );
    }

     
     const gatewayPayment =
        await paymentGateway.fetchPayment(
            razorpayPaymentId,
        );

    if (
        gatewayPayment.gatewayOrderId !==
        attempt.gatewayOrderId
    ) {
        throw new AppError(
            ERROR_CODES.CONFLICT,
            "Payment does not belong to this payment attempt",
            409,
        );
    }


     if (
        gatewayPayment.amountInPaise !==
        order.totalInPaise
    ) {
        throw new AppError(
            ERROR_CODES.CONFLICT,
            "Payment amount does not match order amount",
            409,
        );
    }


      if (gatewayPayment.status !== "captured") {
        throw new AppError(
            ERROR_CODES.CONFLICT,
            "Payment has not been captured",
            409,
        );
    }

   return paymentService.markPaymentSuccessful({
    paymentId: attempt.paymentId,
    paymentAttemptId: attempt.id,
    orderId: attempt.payment.orderId,
    amountInPaise: attempt.payment.amountInPaise,
    gatewayPaymentId: razorpayPaymentId,
    gatewaySignature: razorpaySignature,
});

    },



    async  markPaymentSuccessful(
    input: PaymentSuccessInput,
) {
    return prisma.$transaction(async (tx) => {
        const attempt = await paymentRepository.findAttemptById(
            input.paymentAttemptId,
            tx,
        );

        if (!attempt) {
            throw new AppError(
                ERROR_CODES.PAYMENT_ATTEMPT_NOT_FOUND,
                "Payment attempt not found",
                404,
            );
        }

        if (attempt.paymentId !== input.paymentId) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Payment attempt does not belong to this payment",
                409,
            );
        }

        if (attempt.payment.orderId !== input.orderId) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Payment attempt does not belong to this order",
                409,
            );
        }

        if (attempt.payment.amountInPaise !== input.amountInPaise) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Payment amount does not match payment record",
                409,
            );
        }

        /*
         * Idempotency:
         *
         * If the payment was already successfully processed,
         * simply return success instead of creating another
         * PAYMENT_SUCCESS event.
         */
        if (
            attempt.status === "SUCCESS" &&
            attempt.payment.status === "SUCCESS"
        ) {
            return {
                paymentId: attempt.paymentId,
                paymentAttemptId: attempt.id,
                orderId: attempt.payment.orderId,
                status: "SUCCESS" as const,
            };
        }

        /*
         * We only allow:
         *
         * PaymentAttempt: CREATED → SUCCESS
         * Payment:        PENDING → SUCCESS
         */
        if (attempt.status !== "CREATED") {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                `Payment attempt cannot be completed because its status is ${attempt.status}`,
                409,
            );
        }

        if (attempt.payment.status !== "PENDING") {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                `Payment cannot be completed because its status is ${attempt.payment.status}`,
                409,
            );
        }

        const attemptUpdate =
            await paymentRepository.updatePaymentAttemptStatus(
                attempt.id,
                "CREATED",
                "SUCCESS",
                tx,
            );

        const paymentUpdate =
            await paymentRepository.updatePaymentStatus(
                attempt.paymentId,
                "PENDING",
                "SUCCESS",
                tx,
            );

        /*
         * Concurrent requests can reach this point simultaneously.
         *
         * If another request already completed the payment,
         * re-check the database and make this operation idempotent.
         */
        if (
            attemptUpdate.count !== 1 ||
            paymentUpdate.count !== 1
        ) {
            const latestAttempt =
                await paymentRepository.findAttemptById(
                    input.paymentAttemptId,
                    tx,
                );

            if (
                latestAttempt?.status === "SUCCESS" &&
                latestAttempt.payment.status === "SUCCESS"
            ) {
                return {
                    paymentId: latestAttempt.paymentId,
                    paymentAttemptId: latestAttempt.id,
                    orderId: latestAttempt.payment.orderId,
                    status: "SUCCESS" as const,
                };
            }

            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Payment could not be completed",
                409,
            );
        }

        await paymentRepository.updatePaymentAttemptGatewayDetails(
            attempt.id,
            input.gatewayPaymentId,
            input.gatewaySignature,
            tx,
        );

        await outboxRepository.createEvent(
            {
                eventType: "PAYMENT_SUCCESS",
                aggregateType: "PAYMENT",
                aggregateId: attempt.paymentId,
                payload: {
                    paymentId: attempt.paymentId,
                    paymentAttemptId: attempt.id,
                    orderId: attempt.payment.orderId,
                    amountInPaise: attempt.payment.amountInPaise,
                },
            },
            tx,
        );

        return {
            paymentId: attempt.paymentId,
            paymentAttemptId: attempt.id,
            orderId: attempt.payment.orderId,
            status: "SUCCESS" as const,
        };
    });
}
}