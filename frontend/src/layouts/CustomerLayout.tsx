import { Outlet } from "react-router-dom";

import {
    CartProvider,
    useCartContext,
} from "../context/CartContext";

import { CustomerHeader } from "../features/menu/components/layout/CustomerHeader";
import { CustomerFooter } from "../features/menu/components/layout/CustomerFooter";

function CustomerContent() {
    const { cart } = useCartContext();

    return (
        <>
            <CustomerHeader
                cartItemCount={cart?.items.length ?? 0}
            />

            <main>
                <Outlet />
            </main>

            <CustomerFooter />
        </>
    );
}

export function CustomerLayout() {
    return (
        <CartProvider>
            <CustomerContent />
        </CartProvider>
    );
}