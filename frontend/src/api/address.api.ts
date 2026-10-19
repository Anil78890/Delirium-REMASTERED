
import { apiClient } from "../lib/api/client";

export type SavedAddress = {
    id: string;
    userId: string;
    label: string;
    recipientName: string;
    phoneNumber: string;
    addressLine: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreateAddressInput = {
    label: string;
    recipientName: string;
    phoneNumber: string;
    addressLine: string;
    latitude: number;
    longitude: number;
    isDefault?: boolean;
};

export type UpdateAddressInput =
    Partial<CreateAddressInput>;

interface AddressResponse {
    success: boolean;
    data: SavedAddress;
}

interface AddressesResponse {
    success: boolean;
    data: SavedAddress[];
}

export async function getAddresses(): Promise<SavedAddress[]> {
    const response =
        await apiClient.get<AddressesResponse>("/addresses/");

    return response.data.data;
}

export async function createAddress(
    input: CreateAddressInput,
): Promise<SavedAddress> {
    const response =
        await apiClient.post<AddressResponse>(
            "/addresses/",
            input,
        );

    return response.data.data;
}

export async function updateAddress(
    addressId: string,
    input: UpdateAddressInput,
): Promise<SavedAddress> {
    const response =
        await apiClient.patch<AddressResponse>(
            `/addresses/${addressId}`,
            input,
        );

    return response.data.data;
}

export async function deleteAddress(
    addressId: string,
): Promise<void> {
    await apiClient.delete(`/addresses/${addressId}`);
}

export async function setDefaultAddress(
    addressId: string,
): Promise<SavedAddress> {
    const response =
        await apiClient.patch<AddressResponse>(
            `/addresses/${addressId}/default`,
        );

    return response.data.data;
}
