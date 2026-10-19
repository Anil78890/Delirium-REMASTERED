import type { MenuItem } from "./menu.types";

export interface CartItem {
    id: string;
    cartId: string;
    menuItemId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    menuItem: MenuItem;
}

export interface Cart {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: CartItem[];
}