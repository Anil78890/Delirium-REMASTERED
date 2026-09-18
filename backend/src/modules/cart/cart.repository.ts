import { prisma } from "../../config/prisma.js";
import type { PrismaClient } from "../../generated/prisma/client.js";


type CartDb = Pick<
    PrismaClient,
    "cart" | "cartItem" | "$executeRaw" | "$queryRaw"
>;

import type {
    CreateCartItemData,
} from "./cart.types.js";

export const cartRepository = {
    findCartByUserId(userId: string) {
        return prisma.cart.findUnique({
            where: {
                userId,
            },
        });
    },

    createCart(userId: string) {
        return prisma.cart.create({
            data: {
                userId,
            },
        });
    },

    findCartById(cartId: string) {
        return prisma.cart.findUnique({
            where: {
                id: cartId,
            },
        });
    },

    findCartItem(
        cartId: string,
        menuItemId: string,
    ) {
        return prisma.cartItem.findUnique({
            where: {
                cartId_menuItemId: {
                    cartId,
                    menuItemId,
                },
            },
        });
    },

    findCartItemById(cartItemId: string) {
    return prisma.cartItem.findUnique({
        where: {
            id: cartItemId,
        },
    });
},

    createCartItem(data: CreateCartItemData) {
        return prisma.cartItem.create({
            data,
        });
    },

    updateCartItemQuantity(
        cartItemId: string,
        quantity: number,
    ) {
        return prisma.cartItem.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity,
            },
        });
    },

    deleteCartItem(cartItemId: string) {
        return prisma.cartItem.delete({
            where: {
                id: cartItemId,
            },
        });
    },

    clearCart(
    cartId: string,
    db: CartDb = prisma,
) {
    return db.cartItem.deleteMany({
        where: {
            cartId,
        },
    });
},

    findCartWithItems(cartId: string) {
        return prisma.cart.findUnique({
            where: {
                id: cartId,
            },
            include: {
                items: {
                    include: {
                        menuItem: {
                            include: {
                                category: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
    },


    lockCartForCheckout(
    userId: string,
    db: CartDb = prisma,
) {
    return db.$queryRaw<
        Array<{
            id: string;
            userId: string;
        }>
    >`
        SELECT
            "id",
            "userId"
        FROM "Cart"
        WHERE "userId" = ${userId}
        FOR UPDATE
    `;
},

    findCartForCheckout(
    userId: string,
    db: CartDb = prisma,
) {
    return db.cart.findUnique({
        where: {
            userId,
        },
        include: {
            items: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
},

incrementCartItemQuantity(
    cartItemId: string,
    quantityToAdd: number,
    db: CartDb = prisma,
) {
    return db.$executeRaw`
        UPDATE "CartItem"
        SET
            "quantity" = "quantity" + ${quantityToAdd},
            "updatedAt" = NOW()
        WHERE
            "id" = ${cartItemId}
            AND "quantity" + ${quantityToAdd} <= 20
    `;
},
};