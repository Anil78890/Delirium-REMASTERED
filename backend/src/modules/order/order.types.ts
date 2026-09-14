import type { OrderStatus } from "../../generated/prisma/client.js";

export interface CreateOrderItemData {
    menuItemId: string;
    name: string;
    quantity: number;
    unitPriceInPaise: number;
}

export interface CreateOrderData {
    userId: string;
    subtotalInPaise: number;
    totalInPaise: number;
    items: CreateOrderItemData[];
}

export interface UpdateOrderStatusData {
    status: OrderStatus;
}

export const allowedOrderStatusTransitions: Record<
    OrderStatus,
    readonly OrderStatus[]
> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PREPARING", "CANCELLED"],
    PREPARING: ["READY"],
    READY: ["OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};