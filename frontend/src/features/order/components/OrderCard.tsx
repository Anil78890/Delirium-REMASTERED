import type { Order } from "../../../types/order.types";
import { formatInr } from "../../../utils/currency";

interface OrderCardProps {
    order: Order;
}

function getOrderStatusLabel(
    status: Order["status"],
): string {
    switch (status) {
        case "PENDING":
            return "Payment Pending";

        case "CONFIRMED":
            return "Confirmed";

        case "PREPARING":
            return "Being Prepared";

        case "READY":
            return "Ready";

        case "OUT_FOR_DELIVERY":
            return "Out for Delivery";

        case "DELIVERED":
            return "Delivered";

        case "CANCELLED":
            return "Cancelled";
    }
}

export function OrderCard({
    order,
}: OrderCardProps) {
    return (
        <article className="order-card">
           <div className="order-card__header">
    <div>
        <h2 className="order-card__title">
            Order #{order.id}
        </h2>

        <p className="order-card__date">
            Placed on:{" "}
            {new Date(order.createdAt).toLocaleString()}
        </p>
    </div>

    <p
        className={`order-card__status order-card__status--${order.status.toLowerCase()}`}
    >
        {getOrderStatusLabel(order.status)}
    </p>
</div>

            <div className="order-card__items">
                {order.items.map((item) => (
                    <div
                        key={item.id}
                        className="order-card__item"
                    >
                       <span className="order-card__item-name">
    {item.name}
    <span className="order-card__item-quantity">
        × {item.quantity}
    </span>
</span>

                        <span className="order-card__item-price">
                           {formatInr(
    item.unitPriceInPaise *
        item.quantity,
)}
                        </span>
                    </div>
                ))}
            </div>

            <p className="order-card__total">
                Total: {formatInr(order.totalInPaise)}
            </p>
        </article>
    );
}