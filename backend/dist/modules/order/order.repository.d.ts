import type { OrderStatus, PrismaClient } from "../../generated/prisma/client.js";
import type { CreateOrderData } from "./order.types.js";
type OrderDb = Pick<PrismaClient, "order">;
export declare const orderRepository: {
    createOrder(data: CreateOrderData, db?: OrderDb): import("../../generated/prisma/models.js").Prisma__OrderClient<{
        items: {
            id: string;
            orderId: string;
            menuItemId: string;
            name: string;
            quantity: number;
            unitPriceInPaise: number;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        status: OrderStatus;
        subtotalInPaise: number;
        totalInPaise: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findOrderById(orderId: string, db?: OrderDb): import("../../generated/prisma/models.js").Prisma__OrderClient<({
        items: {
            id: string;
            orderId: string;
            menuItemId: string;
            name: string;
            quantity: number;
            unitPriceInPaise: number;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        status: OrderStatus;
        subtotalInPaise: number;
        totalInPaise: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findOrdersByUserId(userId: string, db?: OrderDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        items: {
            id: string;
            orderId: string;
            menuItemId: string;
            name: string;
            quantity: number;
            unitPriceInPaise: number;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        status: OrderStatus;
        subtotalInPaise: number;
        totalInPaise: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOrdersForAdmin(db?: OrderDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<({
        items: {
            id: string;
            orderId: string;
            menuItemId: string;
            name: string;
            quantity: number;
            unitPriceInPaise: number;
            createdAt: Date;
        }[];
        payment: {
            amountInPaise: number;
            gateway: "RAZORPAY";
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
        } | null;
        user: {
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        status: OrderStatus;
        subtotalInPaise: number;
        totalInPaise: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOrderForAdminById(orderId: string, db?: OrderDb): import("../../generated/prisma/models.js").Prisma__OrderClient<({
        items: {
            id: string;
            orderId: string;
            menuItemId: string;
            name: string;
            quantity: number;
            unitPriceInPaise: number;
            createdAt: Date;
        }[];
        payment: {
            amountInPaise: number;
            gateway: "RAZORPAY";
            id: string;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
        } | null;
        user: {
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        status: OrderStatus;
        subtotalInPaise: number;
        totalInPaise: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    updateOrderStatus(orderId: string, currentStatus: OrderStatus, newStatus: OrderStatus, db?: OrderDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findOrderForCancellation(orderId: string, db?: OrderDb): import("../../generated/prisma/models.js").Prisma__OrderClient<({
        payment: {
            id: string;
            orderId: string;
            amountInPaise: number;
            status: import("../../generated/prisma/enums.js").PaymentStatus;
            gateway: import("../../generated/prisma/enums.js").PaymentGateway;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        userId: string;
        status: OrderStatus;
        subtotalInPaise: number;
        totalInPaise: number;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
};
export {};
//# sourceMappingURL=order.repository.d.ts.map