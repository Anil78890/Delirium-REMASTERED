
import { useEffect, useState, type FormEvent } from "react";

import {
    createAddress,
    deleteAddress,
    getAddresses,
    setDefaultAddress,
    updateAddress,
    type SavedAddress,
} from "../../../api/address.api";

import DeliveryLocationMap from "../components/DeliveryLocationMap";
import type { DeliveryLocation } from "../components/DeliveryLocationMap";

type AddressForm = {
    label: string;
    recipientName: string;
    phoneNumber: string;
    addressLine: string;
    latitude: number | null;
    longitude: number | null;
    isDefault: boolean;
};

const initialForm: AddressForm = {
    label: "Home",
    recipientName: "",
    phoneNumber: "",
    addressLine: "",
    latitude: null,
    longitude: null,
    isDefault: false,
};

export function ProfilePage() {
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [form, setForm] = useState<AddressForm>(initialForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function loadAddresses() {
        setLoading(true);
        setError("");

        try {
            const result = await getAddresses();
            setAddresses(result);
        } catch {
            setError("Could not load your saved addresses. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function fetchAddresses() {
            try {
                const result = await getAddresses();

                if (!cancelled) {
                    setAddresses(result);
                }
            } catch {
                if (!cancelled) {
                    setError(
                        "Could not load your saved addresses. Please try again.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchAddresses();

        return () => {
            cancelled = true;
        };
    }, []);

    function updateField<K extends keyof AddressForm>(
        field: K,
        value: AddressForm[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function handleLocationSelect(location: DeliveryLocation) {
        setForm((current) => ({
            ...current,
            latitude: location.latitude,
            longitude: location.longitude,
            addressLine: location.address,
        }));

        setError("");
        setMessage(
            "Location selected. Please check the address and add any missing details.",
        );
    }

    function startEditing(address: SavedAddress) {
        setEditingId(address.id);

        setForm({
            label: address.label,
            recipientName: address.recipientName,
            phoneNumber: address.phoneNumber,
            addressLine: address.addressLine,
            latitude: address.latitude,
            longitude: address.longitude,
            isDefault: address.isDefault,
        });

        setError("");
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function resetForm() {
        setEditingId(null);
        setForm(initialForm);
        setError("");
        setMessage("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setMessage("");

        if (form.latitude === null || form.longitude === null) {
            setError("Please select your delivery location on the map.");
            return;
        }

        if (form.addressLine.trim().length < 5) {
            setError("Please enter a complete delivery address.");
            return;
        }

        setSaving(true);

        try {
            const input = {
                label: form.label,
                recipientName: form.recipientName.trim(),
                phoneNumber: form.phoneNumber.trim(),
                addressLine: form.addressLine.trim(),
                latitude: form.latitude,
                longitude: form.longitude,
                isDefault: form.isDefault,
            };

            if (editingId) {
                await updateAddress(editingId, input);
                setMessage("Address updated successfully.");
            } else {
                await createAddress(input);
                setMessage("Address saved successfully.");
            }

            setEditingId(null);
            setForm(initialForm);
            await loadAddresses();
        } catch {
            setError(
                "Could not save the address. Please check your details and try again.",
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(address: SavedAddress) {
        const confirmed = window.confirm(
            `Delete your "${address.label}" address?`,
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await deleteAddress(address.id);

            if (editingId === address.id) {
                setEditingId(null);
                setForm(initialForm);
            }

            setMessage("Address deleted successfully.");
            await loadAddresses();
        } catch {
            setError("Could not delete this address. Please try again.");
        }
    }

    async function handleSetDefault(addressId: string) {
        setError("");
        setMessage("");

        try {
            await setDefaultAddress(addressId);
            setMessage("Default address updated.");
            await loadAddresses();
        } catch {
            setError("Could not update your default address.");
        }
    }

    return (
        <main className="profile-page">
            <header className="profile-header">
                <p className="profile-eyebrow">YOUR ACCOUNT</p>
                <h1>My Profile</h1>
                <p>Manage your delivery details for a quicker checkout.</p>
            </header>

            <section className="profile-section">
                <h2>{editingId ? "Edit address" : "Add a new address"}</h2>

                <form className="address-form" onSubmit={handleSubmit}>
                    <label>
                        Address label
                        <select
                            value={form.label}
                            onChange={(event) =>
                                updateField("label", event.target.value)
                            }
                            required
                        >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label>
                        Recipient name
                        <input
                            value={form.recipientName}
                            onChange={(event) =>
                                updateField("recipientName", event.target.value)
                            }
                            minLength={2}
                            maxLength={100}
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label>
                        Phone number
                        <input
                            type="tel"
                            value={form.phoneNumber}
                            onChange={(event) =>
                                updateField("phoneNumber", event.target.value)
                            }
                            pattern="[0-9]{10,15}"
                            minLength={10}
                            maxLength={15}
                            autoComplete="tel"
                            title="Enter 10 to 15 digits."
                            required
                        />
                    </label>

                    <div className="address-map-field">
                        <DeliveryLocationMap
                            key={editingId ?? "new-address"}
                            initialPosition={
                                form.latitude !== null &&
                                form.longitude !== null
                                    ? {
                                          latitude: form.latitude,
                                          longitude: form.longitude,
                                      }
                                    : null
                            }
                            onLocationSelect={handleLocationSelect}
                        />
                    </div>

                    <label>
                        Full delivery address
                        <textarea
                            value={form.addressLine}
                            onChange={(event) =>
                                updateField("addressLine", event.target.value)
                            }
                            minLength={5}
                            maxLength={500}
                            rows={3}
                            autoComplete="street-address"
                            placeholder="Select a point on the map, then add house number, floor, apartment or landmark..."
                            required
                        />
                    </label>

                    <p className="address-help-text">
                        The map fills in the detected address. You can edit
                        this field to add details such as your flat number,
                        floor, building name or nearby landmark.
                    </p>

                    {form.latitude !== null &&
                        form.longitude !== null && (
                            <p className="location-coordinates">
                                Selected coordinates:{" "}
                                {form.latitude.toFixed(6)},{" "}
                                {form.longitude.toFixed(6)}
                            </p>
                        )}

                    <label className="default-checkbox">
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(event) =>
                                updateField("isDefault", event.target.checked)
                            }
                        />
                        <span>
                            <strong>Set as my default delivery address</strong>
                            <small>
                                Use this address as my preferred address for
                                future orders.
                            </small>
                        </span>
                    </label>

                    {error && (
                        <p className="profile-error" role="alert">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="profile-message" role="status">
                            {message}
                        </p>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                  ? "Update address"
                                  : "Save address"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="profile-section">
                <h2>Saved addresses</h2>

                {loading ? (
                    <p>Loading your addresses...</p>
                ) : addresses.length === 0 ? (
                    <p className="empty-addresses">
                        You haven't saved any addresses yet.
                    </p>
                ) : (
                    <div className="saved-address-list">
                        {addresses.map((address) => (
                            <article
                                className="saved-address-card"
                                key={address.id}
                            >
                                <div className="saved-address-heading">
                                    <h3>{address.label}</h3>

                                    {address.isDefault && (
                                        <span className="default-badge">
                                            Default
                                        </span>
                                    )}
                                </div>

                                <p className="address-recipient">
                                    {address.recipientName}
                                </p>
                                <p>{address.phoneNumber}</p>
                                <p>{address.addressLine}</p>

                                <div className="address-actions">
                                    <button
                                        type="button"
                                        className="text-button"
                                        onClick={() => startEditing(address)}
                                    >
                                        Edit
                                    </button>

                                    {!address.isDefault && (
                                        <button
                                            type="button"
                                            className="text-button"
                                            onClick={() =>
                                                handleSetDefault(address.id)
                                            }
                                        >
                                            Set as default
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="text-button danger-button"
                                        onClick={() => handleDelete(address)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
