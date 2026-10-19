import { prisma } from "../../config/prisma.js";
export const cartRepository = {
    findCartByUserId(userId) {
        return prisma.cart.findUnique({
            where: {
                userId,
            },
        });
    },
    createCart(userId) {
        return prisma.cart.create({
            data: {
                userId,
            },
        });
    },
    findCartById(cartId) {
        return prisma.cart.findUnique({
            where: {
                id: cartId,
            },
        });
    },
    findCartItem(cartId, menuItemId) {
        return prisma.cartItem.findUnique({
            where: {
                cartId_menuItemId: {
                    cartId,
                    menuItemId,
                },
            },
        });
    },
    findCartItemById(cartItemId) {
        return prisma.cartItem.findUnique({
            where: {
                id: cartItemId,
            },
        });
    },
    createCartItem(data) {
        return prisma.cartItem.create({
            data,
        });
    },
    updateCartItemQuantity(cartItemId, quantity) {
        return prisma.cartItem.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity,
            },
        });
    },
    deleteCartItem(cartItemId) {
        return prisma.cartItem.delete({
            where: {
                id: cartItemId,
            },
        });
    },
    clearCart(cartId, db = prisma) {
        return db.cartItem.deleteMany({
            where: {
                cartId,
            },
        });
    },
    findCartWithItems(cartId) {
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
    lockCartForCheckout(userId, db = prisma) {
        return db.$queryRaw `
        SELECT
            "id",
            "userId"
        FROM "Cart"
        WHERE "userId" = ${userId}
        FOR UPDATE
    `;
    },
    findCartForCheckout(userId, db = prisma) {
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
    incrementCartItemQuantity(cartItemId, quantityToAdd, db = prisma) {
        return db.$executeRaw `
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
//# sourceMappingURL=cart.repository.js.map