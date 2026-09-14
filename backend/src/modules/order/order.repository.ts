import { prisma } from "../../lib/prisma.js";
import type {
    OrderStatus,
    PrismaClient,
} from "../../generated/prisma/client.js";
import type {
    CreateOrderData,
} from "./order.types.js";

type OrderDb = Pick<
    PrismaClient,
    "order"
>;

export const orderRepository = {
    createOrder(
        data: CreateOrderData,
        db: OrderDb = prisma,
    ) {
        return db.order.create({
            data: {
                userId: data.userId,
                subtotalInPaise: data.subtotalInPaise,
                totalInPaise: data.totalInPaise,

                items: {
                    create: data.items.map((item) => ({
                        menuItemId: item.menuItemId,
                        name: item.name,
                        quantity: item.quantity,
                        unitPriceInPaise: item.unitPriceInPaise,
                    })),
                },
            },

            include: {
                items: true,
            },
        });
    },

    findOrderById(
        orderId: string,
        db: OrderDb = prisma,
    ) {
        return db.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: true,
            },
        });
    },

    findOrdersByUserId(
        userId: string,
        db: OrderDb = prisma,
    ) {
        return db.order.findMany({
            where: {
                userId,
            },

            include: {
                items: true,
            },

            orderBy: {
                createdAt: "desc",
            },
        });
    },

    updateOrderStatus(
        orderId: string,
        currentStatus: OrderStatus,
        newStatus: OrderStatus,
        db: OrderDb = prisma,
    ) {
        return db.order.updateMany({
            where: {
                id: orderId,
                status: currentStatus,
            },
            data: {
                status: newStatus,
            },
        });
    },

    findOrderForCancellation(
        orderId: string,
        db: OrderDb = prisma,
    ) {
        return db.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                payment: true,
            },
        });
    },
};