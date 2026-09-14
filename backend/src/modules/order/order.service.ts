import { prisma } from "../../lib/prisma.js";
import crypto from "node:crypto";

import { paymentRepository } from "../payment/payment.repository.js";
import { refundRepository } from "../payment/refund.repository.js";

import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

import { cartRepository } from "../cart/cart.repository.js";
import { orderRepository } from "./order.repository.js";

import {
    allowedOrderStatusTransitions,
} from "./order.types.js";

import type { OrderStatus } from "../../generated/prisma/client.js";
import { outboxRepository } from "../payment/outbox.repository.js";

export const orderService = {
    async createOrder(userId: string) {
        return prisma.$transaction(async (tx) => {
            const cart =
                await cartRepository.findCartForCheckout(
                    userId,
                    tx,
                );

            if (!cart || cart.items.length === 0) {
                throw new AppError(
                    ERROR_CODES.VALIDATION_ERROR,
                    "Cart is empty",
                    400,
                );
            }

            let subtotalInPaise = 0;

            const items = cart.items.map((cartItem) => {
                const menuItem = cartItem.menuItem;

                if (!menuItem.isActive) {
                    throw new AppError(
                        ERROR_CODES.VALIDATION_ERROR,
                        `Menu item "${menuItem.name}" is no longer available`,
                        400,
                    );
                }

                if (!menuItem.isAvailable) {
                    throw new AppError(
                        ERROR_CODES.VALIDATION_ERROR,
                        `Menu item "${menuItem.name}" is currently unavailable`,
                        400,
                    );
                }

                const itemTotal =
                    menuItem.priceInPaise *
                    cartItem.quantity;

                subtotalInPaise += itemTotal;

                return {
                    menuItemId: menuItem.id,
                    name: menuItem.name,
                    quantity: cartItem.quantity,
                    unitPriceInPaise:
                        menuItem.priceInPaise,
                };
            });

            const order =
                await orderRepository.createOrder(
                    {
                        userId,
                        subtotalInPaise,
                        totalInPaise: subtotalInPaise,
                        items,
                    },
                    tx,
                );

            await cartRepository.clearCart(
                cart.id,
                tx,
            );

            return order;
        });
    },

    async getOrders(userId: string) {
        return orderRepository.findOrdersByUserId(
            userId,
        );
    },

    async getOrderById(
        userId: string,
        orderId: string,
    ) {
        const order =
            await orderRepository.findOrderById(
                orderId,
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
                "You do not have permission to access this order",
                403,
            );
        }

        return order;
    },

    async updateOrderStatus(
        orderId: string,
        newStatus: OrderStatus,
    ) {
        const order =
            await orderRepository.findOrderById(
                orderId,
            );

        if (!order) {
            throw new AppError(
                ERROR_CODES.ORDER_NOT_FOUND,
                "Order not found",
                404,
            );
        }

        const allowedStatuses =
            allowedOrderStatusTransitions[
                order.status
            ];

        if (!allowedStatuses.includes(newStatus)) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                `Order cannot transition from ${order.status} to ${newStatus}`,
                409,
            );
        }

        const result =
            await orderRepository.updateOrderStatus(
                orderId,
                order.status,
                newStatus,
            );

        if (result.count !== 1) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Order status was changed by another request",
                409,
            );
        }

        const updatedOrder =
            await orderRepository.findOrderById(
                orderId,
            );

        if (!updatedOrder) {
            throw new AppError(
                ERROR_CODES.ORDER_NOT_FOUND,
                "Order not found",
                404,
            );
        }

        return updatedOrder;
    },

    async confirmOrderAfterPayment(
        orderId: string,
    ) {
        const result =
            await orderRepository.updateOrderStatus(
                orderId,
                "PENDING",
                "CONFIRMED",
            );

        if (result.count === 1) {
            return {
                confirmed: true,
            };
        }

        const order =
            await orderRepository.findOrderById(
                orderId,
            );

        if (!order) {
            throw new AppError(
                ERROR_CODES.ORDER_NOT_FOUND,
                "Order not found",
                404,
            );
        }

        if (order.status === "CONFIRMED") {
            return {
                confirmed: false,
                alreadyConfirmed: true,
            };
        }

        throw new AppError(
            ERROR_CODES.CONFLICT,
            `Order cannot be confirmed because its status is ${order.status}`,
            409,
        );
    },

    async cancelOrder(
    orderId: string,
    reason?: string,
) {
    return prisma.$transaction(async (tx) => {

        const order =
            await orderRepository.findOrderForCancellation(
                orderId,
                tx,
            );

        if (!order) {
            throw new AppError(
                ERROR_CODES.ORDER_NOT_FOUND,
                "Order not found",
                404,
            );
        }

        const allowedStatuses =
            allowedOrderStatusTransitions[order.status];

        if (!allowedStatuses.includes("CANCELLED")) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                `Order cannot be cancelled because its status is ${order.status}`,
                409,
            );
        }

        const result =
            await orderRepository.updateOrderStatus(
                orderId,
                order.status,
                "CANCELLED",
                tx,
            );

        if (result.count !== 1) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Order status was changed by another request",
                409,
            );
        }

        /*
         * No payment or unsuccessful payment:
         * cancellation is complete without a refund.
         */
        if (
            !order.payment ||
            order.payment.status !== "SUCCESS"
        ) {
            return {
                orderId,
                status: "CANCELLED" as const,
                refundRequired: false,
            };
        }

        const successfulAttempt =
            await paymentRepository.findSuccessfulAttemptByPaymentId(
                order.payment.id,
                tx,
            );

        if (
            !successfulAttempt ||
            !successfulAttempt.gatewayPaymentId
        ) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Successful payment attempt could not be found for refund",
                409,
            );
        }

        if (
            order.payment.amountInPaise !==
            order.totalInPaise
        ) {
            throw new AppError(
                ERROR_CODES.CONFLICT,
                "Payment amount does not match order amount",
                409,
            );
        }

        const refundId = crypto.randomUUID();

        const refund =
            await refundRepository.create(
                {
                    id: refundId,
                    paymentId: order.payment.id,
                    amountInPaise: order.payment.amountInPaise,
                    gatewayPaymentId:
                        successfulAttempt.gatewayPaymentId,
                    idempotencyKey: refundId,
                    reason: "",
                },
                tx,
            );


        await outboxRepository.createEvent(
            {
                eventType: "REFUND_REQUESTED",
                aggregateType: "Refund",
                aggregateId: refund.id,
                payload: {
                    refundId: refund.id,
                    paymentId: order.payment.id,
                    orderId: order.id,
                    amountInPaise: refund.amountInPaise,
                }
            }
        );    

        return {
            orderId,
            status: "CANCELLED" as const,
            refundRequired: true,
            refundId: refund.id,
            refundStatus: refund.status,
        };
    });
},
};