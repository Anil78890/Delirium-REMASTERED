import { useEffect, useState } from "react";

import { getOrders } from "../../../api/order.api";
import type { Order } from "../../../types/order.types";
import { OrderCard } from "../components/OrderCard";
import { Link } from "react-router-dom";


export function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadOrders() {
            try {
                const data = await getOrders();

                if (!isMounted) {
                    return;
                }

                setOrders(data);
            } catch (error) {
                console.error(
                    "Failed to load orders:",
                    error,
                );

                if (isMounted) {
                    setError(
                        "Unable to load your orders.",
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <section className="orders-page">
                <p>Loading your orders...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="orders-page">
                <p>{error}</p>
            </section>
        );
    }

 if (orders.length === 0) {
    return (
        <section className="orders-page">
            <h1 className="orders-page__title">
                Your Orders
            </h1>

            <p className="orders-page__subtitle">
                Track your recent orders and their current status.
            </p>

            <div className="orders-page__empty">
                <p>
                    You haven't placed any orders yet.
                </p>

                <Link
                    to="/menu"
                    className="orders-page__empty-link"
                >
                    Explore the Menu
                </Link>
            </div>
        </section>
    );
}

    return (
        <section className="orders-page">
          <h1 className="orders-page__title">
    Your Orders
</h1>

<p className="orders-page__subtitle">
    Track your recent orders and their current status.
</p>

            <div>
               <div className="orders-page__list">
    {orders.map((order) => (
        <OrderCard
            key={order.id}
            order={order}
        />
    ))}
</div>
            </div>
        </section>
    );
}