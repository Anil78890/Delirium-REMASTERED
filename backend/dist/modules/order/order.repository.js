import { prisma } from "../../config/prisma.js";
export const orderRepository = {
    createOrder(data, db = prisma) {
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
    findOrderById(orderId, db = prisma) {
        return db.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: true,
            },
        });
    },
    findOrdersByUserId(userId, db = prisma) {
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
    findOrdersForAdmin(db = prisma) {
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
    findOrderForAdminById(orderId, db = prisma) {
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
    updateOrderStatus(orderId, currentStatus, newStatus, db = prisma) {
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
    findOrderForCancellation(orderId, db = prisma) {
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
//# sourceMappingURL=order.repository.js.map