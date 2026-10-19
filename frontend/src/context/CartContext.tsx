import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    addCartItem,
    clearCart,
    getCart,
    removeCartItem,
    updateCartItem,
} from "../api/cart.api";

import type { Cart } from "../types/cart.types";
import type { MenuItem } from "../types/menu.types";

import { useAuth } from "../hooks/useAuth";

interface CartContextValue {
    cart: Cart | null;
    isLoading: boolean;

    addItem: (menuItem: MenuItem) => Promise<void>;

    updateItem: (
        cartItemId: string,
        quantity: number,
    ) => Promise<void>;

    removeItem: (cartItemId: string) => Promise<void>;

    clearCartItems: () => Promise<void>;

    clearCartState: () => void;
}

const CartContext =
    createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({
    children,
}: CartProviderProps) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        isAuthenticated,
        isLoading: isAuthLoading,
    } = useAuth();

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
                console.error(
                    "Failed to load cart:",
                    error,
                );
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
        await updateCartItem(
            cartItemId,
            quantity,
        );

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

    function clearCartState() {
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

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                addItem,
                updateItem,
                removeItem,
                clearCartItems,
                clearCartState,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext(): CartContextValue {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCartContext must be used inside CartProvider",
        );
    }

    return context;
}