export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    id: string;
    orderId: string;
    menuItemId: string;
    name: string;
    quantity: number;
    unitPriceInPaise: number;
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    subtotalInPaise: number;
    totalInPaise: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}