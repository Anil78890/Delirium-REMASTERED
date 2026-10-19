import { Link } from "react-router-dom";

import { useCartContext } from "../../../context/CartContext";

export function CartPage() {
    const {
        cart,
        isLoading,
        updateItem,
        removeItem,
    } = useCartContext();

    const subtotalInPaise =
        cart?.items.reduce(
            (total, item) =>
                total +
                item.menuItem.priceInPaise * item.quantity,
            0,
        ) ?? 0;

    return (
        <section className="cart-page">
            <div className="cart-page__header">
                <h1 className="cart-page__title">
                    Your Cart
                </h1>

                <Link
                    to="/menu"
                    className="cart-page__continue"
                >
                    Continue Shopping
                </Link>
            </div>

            {isLoading ? (
                <p className="cart-page__loading">
                    Loading cart...
                </p>
            ) : !cart || cart.items.length === 0 ? (
                <div className="cart-page__empty">
                    <h2 className="cart-page__empty-title">
                        Your cart is empty
                    </h2>

                    <p className="cart-page__empty-text">
                        Add something delicious from the menu to get started.
                    </p>

                    <Link
                        to="/menu"
                        className="cart-page__checkout"
                    >
                        Explore Menu
                    </Link>
                </div>
            ) : (
                <div className="cart-page__content">
                    <div className="cart-page__items">
                        {cart.items.map((item) => (
                            <article
                                key={item.id}
                                className="cart-page__item"
                            >
                                <div className="cart-page__item-info">
                                    <h2 className="cart-page__item-name">
                                        {item.menuItem.name}
                                    </h2>

                                    <p className="cart-page__item-price">
                                        Price: ₹
                                        {item.menuItem.priceInPaise / 100}
                                    </p>

                                    <p className="cart-page__item-total">
                                        Total: ₹
                                        {(item.menuItem.priceInPaise *
                                            item.quantity) /
                                            100}
                                    </p>
                                </div>

                                <div className="cart-page__item-actions">
                                    <div className="cart-page__quantity">
                                        <button
                                            type="button"
                                            className="cart-page__quantity-button"
                                            onClick={() => {
                                                void updateItem(
                                                    item.id,
                                                    item.quantity - 1,
                                                );
                                            }}
                                            disabled={item.quantity <= 1}
                                            aria-label={`Decrease quantity of ${item.menuItem.name}`}
                                        >
                                            −
                                        </button>

                                        <span className="cart-page__quantity-value">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            className="cart-page__quantity-button"
                                            onClick={() => {
                                                void updateItem(
                                                    item.id,
                                                    item.quantity + 1,
                                                );
                                            }}
                                            aria-label={`Increase quantity of ${item.menuItem.name}`}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="cart-page__remove"
                                        onClick={() => {
                                            void removeItem(item.id);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="cart-page__summary">
                        <h2 className="cart-page__summary-title">
                            Order Summary
                        </h2>

                        <div className="cart-page__summary-row">
                            <span className="cart-page__summary-label">
                                Subtotal
                            </span>

                            <span className="cart-page__summary-total">
                                ₹{subtotalInPaise / 100}
                            </span>
                        </div>

                        <Link
                            to="/checkout"
                            className="cart-page__checkout"
                        >
                            Proceed to Checkout
                        </Link>
                    </aside>
                </div>
            )}
        </section>
    );
}