import { useEffect, useState } from "react";
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from "../api/cart.api";
import type { Cart } from "../types/cart.types";
import type { MenuItem } from "../types/menu.types";
import { useAuth } from "./useAuth";



export function useCart() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

   useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
        return;
    }

    let isMounted = true;

    async function loadCart() {
        try {
            const currentCart = await getCart();

            if (!isMounted) {
                return;
            }

            setCart(currentCart);
        } catch (error) {
            console.error("Failed to load cart:", error);
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
    }

    void loadCart();

    return () => {
        isMounted = false;
    };
}, [isAuthenticated, isAuthLoading]);



async function addItem(menuItem: MenuItem) {
    await addCartItem(menuItem.id);

    const updatedCart = await getCart();

    setCart(updatedCart);
}

async function updateItem(
    cartItemId: string,
    quantity: number,
) {
    await updateCartItem(cartItemId, quantity);

    const updatedCart = await getCart();

    setCart(updatedCart);
}

async function removeItem(cartItemId: string) {
    await removeCartItem(cartItemId);

    const updatedCart = await getCart();

    setCart(updatedCart);
}

async function clearCartItems() {
    await clearCart();

    setCart((currentCart) => {
        if (!currentCart) {
            return currentCart;
        }

        return {
            ...currentCart,
            items: [],
        };
    });
}

    return {
    cart,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    clearCartItems,
};
}