
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCartContext } from "../../../context/CartContext";

import {
    createOrder,
    getOrder,
} from "../../../api/order.api";

import {
    createPaymentOrder,
    verifyPayment,
} from "../../../api/payment.api";

import {
    getAddresses,
    type SavedAddress,
} from "../../../api/address.api";

import type { Order } from "../../../types/order.types";
import type { RazorpayPaymentResponse } from "../../../types/razorpay.types";
import { formatInr } from "../../../utils/currency";




function calculateDistanceKm(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
): number {
    const toRadians = (degrees: number) =>
        (degrees * Math.PI) / 180;

    const latitudeDifference = toRadians(latitude2 - latitude1);
    const longitudeDifference = toRadians(longitude2 - longitude1);

    const haversine =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(toRadians(latitude1)) *
            Math.cos(toRadians(latitude2)) *
            Math.sin(longitudeDifference / 2) ** 2;

    return (
        6371 *
        2 *
        Math.atan2(
            Math.sqrt(haversine),
            Math.sqrt(1 - haversine),
        )
    );
}


export function CheckoutPage() {
    const {
        cart,
        isLoading,
        clearCartState,
    } = useCartContext();


    const RESTAURANT_LATITUDE = 22.503053546678277;
const RESTAURANT_LONGITUDE = 88.36097805582347;
const DELIVERY_RADIUS_KM = 5;


    const [isSubmitting, setIsSubmitting] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [addressLoadError, setAddressLoadError] = useState<string | null>(null);

    const [customerLocation, setCustomerLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);


    const deliveryDistanceKm = customerLocation
    ? calculateDistanceKm(
          RESTAURANT_LATITUDE,
          RESTAURANT_LONGITUDE,
          customerLocation.latitude,
          customerLocation.longitude,
      )
    : null;

const isDeliveryAvailable =
    deliveryDistanceKm !== null &&
    deliveryDistanceKm <= DELIVERY_RADIUS_KM;

    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
    const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);

   const isDeliveryDetailsValid =
    /^\d{10,15}$/.test(phoneNumber.trim()) &&
    deliveryAddress.trim().length >= 5 &&
    customerLocation !== null &&
    isDeliveryAvailable;

    const subtotalInPaise =
        cart?.items.reduce(
            (total, item) =>
                total + item.menuItem.priceInPaise * item.quantity,
            0,
        ) ?? 0;

    useEffect(() => {
        let cancelled = false;

        async function loadSavedAddresses() {
            try {
                setIsLoadingAddresses(true);
                setAddressLoadError(null);

                const addresses = await getAddresses();

                if (cancelled) return;

                setSavedAddresses(addresses);

                const defaultAddress =
                    addresses.find((address) => address.isDefault) ??
                    addresses[0];

                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                    setPhoneNumber(defaultAddress.phoneNumber);
                    setDeliveryAddress(defaultAddress.addressLine);

                    setCustomerLocation({
                        latitude: defaultAddress.latitude,
                        longitude: defaultAddress.longitude,
                    });
                }
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Failed to load saved addresses:",
                    error,
                );

                setAddressLoadError(
                    "Could not load your saved addresses. Please try again or visit your profile to manage them.",
                );
            } finally {
                if (!cancelled) {
                    setIsLoadingAddresses(false);
                }
            }
        }

        void loadSavedAddresses();

        return () => {
            cancelled = true;
        };
    }, []);

    function handleAddressSelection(addressId: string) {
        setSelectedAddressId(addressId);

        if (!addressId) {
            setPhoneNumber("");
            setDeliveryAddress("");
            setCustomerLocation(null);
            return;
        }

        const selectedAddress = savedAddresses.find(
            (address) => address.id === addressId,
        );

        if (!selectedAddress) return;

        setPhoneNumber(selectedAddress.phoneNumber);
        setDeliveryAddress(selectedAddress.addressLine);

        setCustomerLocation({
            latitude: selectedAddress.latitude,
            longitude: selectedAddress.longitude,
        });
    }

    if (isLoading) {
        return (
            <section className="checkout-page">
                <p className="checkout-page__loading">
                    Loading checkout...
                </p>
            </section>
        );
    }

    if (createdOrder) {
        return (
            <section className="checkout-page">
                <div className="checkout-page__success">
                    <h1 className="checkout-page__success-title">
                        Order Confirmed
                    </h1>

                    <p className="checkout-page__success-text">
                        Your payment was successful and your order
                        has been confirmed.
                    </p>

                    <p className="checkout-page__success-order">
                        Order ID: {createdOrder.id}
                    </p>

                    <Link
                        to="/orders"
                        className="checkout-page__success-link"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/menu"
                        className="checkout-page__success-link"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </section>
        );
    }

    if (paymentError) {
        return (
            <section className="checkout-page">
                <div className="checkout-page__error">
                    <h1 className="checkout-page__error-title">
                        Payment Verification Pending
                    </h1>

                    <p className="checkout-page__error-text">
                        {paymentError}
                    </p>

                    <Link
                        to="/orders"
                        className="checkout-page__error-link"
                    >
                        Check My Orders
                    </Link>

                    <Link
                        to="/menu"
                        className="checkout-page__error-link"
                    >
                        Return to Menu
                    </Link>
                </div>
            </section>
        );
    }

    if (paymentMessage) {
        return (
            <section className="checkout-page">
                <div className="checkout-page__success">
                    <h1 className="checkout-page__success-title">
                        Payment Received
                    </h1>

                    <p className="checkout-page__success-text">
                        {paymentMessage}
                    </p>

                    <Link
                        to="/orders"
                        className="checkout-page__success-link"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/menu"
                        className="checkout-page__success-link"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </section>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <section className="checkout-page">
                <div className="checkout-page__empty">
                    <h1 className="checkout-page__empty-title">
                        Your cart is empty
                    </h1>

                    <p className="checkout-page__empty-text">
                        Add something from the menu before
                        checking out.
                    </p>

                    <Link
                        to="/menu"
                        className="checkout-page__back"
                    >
                        Back to Menu
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout-page">
            <div className="checkout-page__header">
                <h1 className="checkout-page__title">
                    Checkout
                </h1>

                <Link
                    to="/cart"
                    className="checkout-page__back"
                >
                    Back to Cart
                </Link>
            </div>

            <div className="checkout-page__delivery">
                <h2>Delivery Details</h2>

                <div className="checkout-page__field">
                    <label htmlFor="savedAddress">
                        Choose a Saved Address
                    </label>

                    <select
                        id="savedAddress"
                        value={selectedAddressId}
                        onChange={(event) =>
                            handleAddressSelection(event.target.value)
                        }
                        disabled={isLoadingAddresses}
                    >
                        <option value="">
                            Select a saved address
                        </option>

                        {savedAddresses.map((address) => (
                            <option
                                key={address.id}
                                value={address.id}
                            >
                                {address.label}
                                {address.isDefault ? " (Default)" : ""}
                                {" — "}
                                {address.addressLine}
                            </option>
                        ))}
                    </select>

                    {isLoadingAddresses && (
                        <p role="status">
                            Loading your saved addresses...
                        </p>
                    )}

                    {addressLoadError && (
                        <p role="alert">
                            {addressLoadError}
                        </p>
                    )}

                    {!isLoadingAddresses &&
                        savedAddresses.length === 0 && (
                            <p>
                                You have no saved addresses.{" "}
                                <Link to="/profile">
                                    Add an address in your profile
                                </Link>
                                {" "}before checking out.
                            </p>
                        )}

                    <p>
                        Need to add or manage addresses?{" "}
                        <Link to="/profile">
                            Manage saved addresses
                        </Link>
                    </p>
                </div>

                <div className="checkout-page__field">
                    <label htmlFor="phoneNumber">
                        Phone Number{" "}
                        <span className="required-asterisk">*</span>
                    </label>

                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => {
                            setPhoneNumber(event.target.value);
                        }}
                        placeholder="Enter your phone number"
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={15}
                        required
                    />
                </div>

                <div className="checkout-page__field">
                    <label htmlFor="deliveryAddress">
                        Full Delivery Address{" "}
                        <span className="required-asterisk">*</span>
                    </label>

                   
<textarea
    id="deliveryAddress"
    name="deliveryAddress"
    value={deliveryAddress}
    placeholder="Select a saved address"
    autoComplete="street-address"
    rows={4}
    readOnly
    required
/>


                    {deliveryDistanceKm !== null && (
    <p role="status">
        {isDeliveryAvailable
            ? `Delivery available — approximately ${deliveryDistanceKm.toFixed(2)} km from the restaurant.`
            : `Delivery unavailable — approximately ${deliveryDistanceKm.toFixed(2)} km away. Delivery is limited to ${DELIVERY_RADIUS_KM} km.`}
    </p>
)}
                </div>
            </div>

            <div className="checkout-page__content">
                <div className="checkout-page__items">
                    <h2 className="checkout-page__section-title">
                        Your Order
                    </h2>

                    {cart.items.map((item) => (
                        <article
                            key={item.id}
                            className="checkout-page__item"
                        >
                            <div className="checkout-page__item-info">
                                <h3 className="checkout-page__item-name">
                                    {item.menuItem.name}
                                </h3>

                                <p className="checkout-page__item-quantity">
                                    Quantity: {item.quantity}
                                </p>
                            </div>

                            <span className="checkout-page__item-total">
                                {formatInr(
                                    item.menuItem.priceInPaise *
                                        item.quantity,
                                )}
                            </span>
                        </article>
                    ))}
                </div>

                <aside className="checkout-page__summary">
                    <h2 className="checkout-page__summary-title">
                        Order Summary
                    </h2>

                    <div className="checkout-page__summary-row">
                        <span>Subtotal</span>

                        <strong>
                            {formatInr(subtotalInPaise)}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className="checkout-page__submit"
                        disabled={
                            isSubmitting ||
                            isPaymentOpen ||
                            isLoadingAddresses ||
                            !isDeliveryDetailsValid
                        }
                        onClick={async () => {
                            try {
                                setIsSubmitting(true);

                                if (!customerLocation) {
                                    throw new Error(
                                        "Please select a saved address before placing your order.",
                                    );
                                }

                                const order = await createOrder({
                                    phoneNumber: phoneNumber.trim(),
                                    deliveryAddress: deliveryAddress.trim(),
                                    latitude: customerLocation.latitude,
                                    longitude: customerLocation.longitude,
                                });

                                const paymentOrder =
                                    await createPaymentOrder(order.id);

                                const razorpayOptions = {
                                    key: import.meta.env
                                        .VITE_RAZORPAY_KEY_ID,

                                    amount: paymentOrder.amountInPaise,
                                    currency: paymentOrder.currency,
                                    name: "DELIRIUM",
                                    description: `Order ${order.id}`,
                                    order_id: paymentOrder.gatewayOrderId,

                                    handler: async (
                                        response: RazorpayPaymentResponse,
                                    ) => {
                                        try {
                                            const verification =
                                                await verifyPayment(response);

                                            clearCartState();

                                            const confirmedOrder =
                                                await getOrder(
                                                    verification.orderId,
                                                );

                                            if (
                                                confirmedOrder.status ===
                                                "CONFIRMED"
                                            ) {
                                                setCreatedOrder(confirmedOrder);
                                            } else {
                                                setPaymentMessage(
                                                    "Your payment was received, but your order is still being processed.",
                                                );
                                            }

                                            setIsPaymentOpen(false);

                                            console.log(
                                                "Payment verified:",
                                                verification,
                                            );

                                            console.log(
                                                "Updated order:",
                                                confirmedOrder,
                                            );
                                        } catch (error) {
                                            setIsPaymentOpen(false);

                                            setPaymentError(
                                                "We couldn't confirm your payment right now. Please check your orders before trying again.",
                                            );

                                            console.error(
                                                "Payment verification failed:",
                                                error,
                                            );
                                        }
                                    },

                                    modal: {
                                        ondismiss: () => {
                                            setIsPaymentOpen(false);

                                            console.log(
                                                "Razorpay checkout dismissed",
                                            );
                                        },
                                    },
                                };

                                const razorpay =
                                    new window.Razorpay(razorpayOptions);

                                razorpay.open();
                                setIsPaymentOpen(true);

                                console.log("Order created:", order);
                                console.log(
                                    "Payment order created:",
                                    paymentOrder,
                                );
                            } catch (error) {
                                console.error(
                                    "Checkout failed:",
                                    error,
                                );
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                    >
                        {isPaymentOpen
                            ? "Payment in Progress..."
                            : isSubmitting
                              ? "Creating Order..."
                              : "Place Order & Pay"}
                    </button>
                </aside>
            </div>
        </section>
    );
}
