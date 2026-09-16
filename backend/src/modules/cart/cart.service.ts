import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

import { cartRepository } from "./cart.repository.js";
import type {
    AddCartItemInput,
    UpdateCartItemInput,
} from "./cart.types.js";

import { menuRepository } from "../menu/menu.repository.js";

export const cartService = {
    async getCart(userId: string) {
        const cart = await cartRepository.findCartByUserId(userId);

        if (!cart) {
            return null;
        }

        return cartRepository.findCartWithItems(cart.id);
    },

    async addItem(
        userId: string,
        input: AddCartItemInput,
    ) {
        const menuItem = await menuRepository.findMenuItemById(
            input.menuItemId,
        );

        if (!menuItem) {
            throw new AppError(
                ERROR_CODES.MENU_ITEM_NOT_FOUND,
                "Menu item not found",
                404,
            );
        }

        if (!menuItem.isActive || !menuItem.isAvailable) {
            throw new AppError(
                ERROR_CODES.MENU_ITEM_UNAVAILABLE,
                "Menu item is currently unavailable",
                400,
            );
        }

        let cart = await cartRepository.findCartByUserId(userId);

        if (!cart) {
            cart = await cartRepository.createCart(userId);
        }

        const existingItem = await cartRepository.findCartItem(
            cart.id,
            input.menuItemId,
        );

        if (existingItem) {
    const result =
        await cartRepository.incrementCartItemQuantity(
            existingItem.id,
            input.quantity,
        );

    if (result === 0) {
        throw new AppError(
            ERROR_CODES.VALIDATION_ERROR,
            "Cart item quantity cannot exceed 20",
            400,
        );
    }

    return cartRepository.findCartItemById(
        existingItem.id,
    );
}

        return cartRepository.createCartItem({
            cartId: cart.id,
            menuItemId: input.menuItemId,
            quantity: input.quantity,
        });
    },

    async updateItem(
        userId: string,
        cartItemId: string,
        input: UpdateCartItemInput,
    ) {
        const cart = await cartRepository.findCartByUserId(userId);

        if (!cart) {
            throw new AppError(
                ERROR_CODES.CART_NOT_FOUND,
                "Cart not found",
                404,
            );
        }

        const cartItem = await cartRepository.findCartItemById(
            cartItemId,
        );

        if (!cartItem || cartItem.cartId !== cart.id) {
            throw new AppError(
                ERROR_CODES.CART_ITEM_NOT_FOUND,
                "Cart item not found",
                404,
            );
        }

        return cartRepository.updateCartItemQuantity(
            cartItemId,
            input.quantity,
        );
    },

    async removeItem(
        userId: string,
        cartItemId: string,
    ) {
        const cart = await cartRepository.findCartByUserId(userId);

        if (!cart) {
            throw new AppError(
                ERROR_CODES.CART_NOT_FOUND,
                "Cart not found",
                404,
            );
        }

        const cartItem = await cartRepository.findCartItemById(
            cartItemId,
        );

        if (!cartItem || cartItem.cartId !== cart.id) {
            throw new AppError(
                ERROR_CODES.CART_ITEM_NOT_FOUND,
                "Cart item not found",
                404,
            );
        }

        await cartRepository.deleteCartItem(cartItemId);
    },

    async clearCart(userId: string) {
        const cart = await cartRepository.findCartByUserId(userId);

        if (!cart) {
            return;
        }

        await cartRepository.clearCart(cart.id);
    },
};