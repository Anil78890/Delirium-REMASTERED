import type { OrderStatus } from "../../generated/prisma/client.js";
export declare const orderService: {
    createOrder(userId: string): Promise<{
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
    }>;
    getOrders(userId: string): Promise<({
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
    getOrderById(userId: string, orderId: string): Promise<{
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
    }>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<{
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
    }>;
    confirmOrderAfterPayment(orderId: string): Promise<{
        confirmed: boolean;
        alreadyConfirmed?: never;
    } | {
        confirmed: boolean;
        alreadyConfirmed: boolean;
    }>;
    getAdminOrders: () => Promise<({
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
    getAdminOrderById: (orderId: string) => Promise<{
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
    }>;
    cancelOrder(orderId: string, reason?: string): Promise<{
        orderId: string;
        status: "CANCELLED";
        refundRequired: boolean;
        refundId?: never;
        refundStatus?: never;
    } | {
        orderId: string;
        status: "CANCELLED";
        refundRequired: boolean;
        refundId: string;
        refundStatus: import("../../generated/prisma/enums.js").RefundStatus;
    }>;
};
//# sourceMappingURL=order.service.d.ts.map