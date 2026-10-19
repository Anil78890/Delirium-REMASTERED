import type { PrismaClient } from "../../generated/prisma/client.js";
type CartDb = Pick<PrismaClient, "cart" | "cartItem" | "$executeRaw" | "$queryRaw">;
import type { CreateCartItemData } from "./cart.types.js";
export declare const cartRepository: {
    findCartByUserId(userId: string): import("../../generated/prisma/models.js").Prisma__CartClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createCart(userId: string): import("../../generated/prisma/models.js").Prisma__CartClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findCartById(cartId: string): import("../../generated/prisma/models.js").Prisma__CartClient<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findCartItem(cartId: string, menuItemId: string): import("../../generated/prisma/models.js").Prisma__CartItemClient<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findCartItemById(cartItemId: string): import("../../generated/prisma/models.js").Prisma__CartItemClient<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createCartItem(data: CreateCartItemData): import("../../generated/prisma/models.js").Prisma__CartItemClient<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    updateCartItemQuantity(cartItemId: string, quantity: number): import("../../generated/prisma/models.js").Prisma__CartItemClient<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    deleteCartItem(cartItemId: string): import("../../generated/prisma/models.js").Prisma__CartItemClient<{
        id: string;
        cartId: string;
        menuItemId: string;
        quantity: number;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    clearCart(cartId: string, db?: CartDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<import("../../generated/prisma/internal/prismaNamespace.js").BatchPayload>;
    findCartWithItems(cartId: string): import("../../generated/prisma/models.js").Prisma__CartClient<({
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    lockCartForCheckout(userId: string, db?: CartDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        userId: string;
    }[]>;
    findCartForCheckout(userId: string, db?: CartDb): import("../../generated/prisma/models.js").Prisma__CartClient<({
        items: ({
            menuItem: {
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    incrementCartItemQuantity(cartItemId: string, quantityToAdd: number, db?: CartDb): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<number>;
};
export {};
//# sourceMappingURL=cart.repository.d.ts.map