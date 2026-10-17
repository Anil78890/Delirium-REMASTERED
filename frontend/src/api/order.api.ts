import { apiClient } from "../lib/api/client";
import type { Order } from "../types/order.types";



type CreateOrderInput = {
    phoneNumber: string;
    deliveryAddress: string;
    latitude: number;
    longitude: number;
};


interface CreateOrderResponse {
    success: boolean;
    data: {
        order: Order;
    };
}

interface GetOrderResponse {
    success: boolean;
    data: {
        order: Order;
    };
}

interface GetOrdersResponse {
    success: boolean;
    data: {
        orders: Order[];
    };
}


export async function createOrder(
    input: CreateOrderInput,
): Promise<Order> {
    const response =
        await apiClient.post<CreateOrderResponse>(
            "/order/",
            input,
        );

    return response.data.data.order;
}


export async function getOrder(
    orderId: string,
): Promise<Order> {
    const response =
        await apiClient.get<GetOrderResponse>(
            `/order/${orderId}`,
        );

    return response.data.data.order;
}


export async function getOrders(): Promise<Order[]> {
    const response =
        await apiClient.get<GetOrdersResponse>(
            "/order/",
        );

    return response.data.data.orders;
}