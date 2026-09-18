import { prisma } from "../../config/prisma.js";
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

   
findOrdersForAdmin(
    db: OrderDb = prisma,
) {
    return db.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            items: true,

            payment: {
                select: {
                    id: true,
                    amountInPaise: true,
                    status: true,
                    gateway: true,
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
    });
},

findOrderForAdminById(
    orderId: string,
    db: OrderDb = prisma,
) {
    return db.order.findUnique({
        where: {
            id: orderId,
        },

        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },

            items: true,

            payment: {
                select: {
                    id: true,
                    amountInPaise: true,
                    status: true,
                    gateway: true,
                },
            },
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