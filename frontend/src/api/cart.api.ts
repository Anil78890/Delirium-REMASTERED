import { apiClient } from "../lib/api/client";

import type { Cart } from "../types/cart.types";

interface GetCartResponse {
    success: boolean;
    data: {
        cart: Cart | null;
    };
}

interface CartItemResponse {
    success: boolean;
    data: {
        cartItem: Cart["items"][number];
    };
}

export async function getCart(): Promise<Cart | null> {
    const response =
        await apiClient.get<GetCartResponse>("/cart/");

    return response.data.data.cart;
}

export async function addCartItem(
    menuItemId: string,
    quantity: number = 1,
): Promise<Cart["items"][number]> {
    const response =
        await apiClient.post<CartItemResponse>(
            "/cart/items",
            {
                menuItemId,
                quantity,
            },
        );

    return response.data.data.cartItem;
}

export async function updateCartItem(
    cartItemId: string,
    quantity: number,
): Promise<Cart["items"][number]> {
    const response =
        await apiClient.patch<CartItemResponse>(
            `/cart/items/${cartItemId}`,
            {
                quantity,
            },
        );

    return response.data.data.cartItem;
}

export async function removeCartItem(
    cartItemId: string,
): Promise<void> {
    await apiClient.delete(`/cart/items/${cartItemId}`);
}

export async function clearCart(): Promise<void> {
    await apiClient.delete("/cart/");
}