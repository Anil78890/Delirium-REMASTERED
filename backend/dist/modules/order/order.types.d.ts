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
export declare const allowedOrderStatusTransitions: Record<OrderStatus, readonly OrderStatus[]>;
//# sourceMappingURL=order.types.d.ts.map