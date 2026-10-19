import type { AddCartItemInput, UpdateCartItemInput } from "./cart.types.js";
export declare const cartService: {
    getCart(userId: string): Promise<({
        items: ({
            menuItem: {
                category: {
                    id: string;
                    name: string;
                    description: string | null;
                    displayOrder: number;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                categoryId: string;
                name: string;
                description: string | null;
                priceInPaise: number;
                imageUrl: string | null;
                isActive: boolean;
                isAvailable: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            cartId: string;
            menuItemId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    addItem(userId: string, input: AddCartItemInput): Promise<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateItem(userId: string, cartItemId: string, input: UpdateCartItemInput): Promise<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeItem(userId: string, cartItemId: string): Promise<void>;
    clearCart(userId: string): Promise<void>;
};
//# sourceMappingURL=cart.service.d.ts.map