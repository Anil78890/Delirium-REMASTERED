
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

import { addressRepository } from "./address.repository.js";

import type {
    CreateAddressInput,
    UpdateAddressInput,
} from "./address.schema.js";

function notFoundError() {
    return new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Address not found",
        404,
    );
}

export const addressService = {
    list(userId: string) {
        return addressRepository.findAllByUserId(userId);
    },

    async create(userId: string, input: CreateAddressInput) {
        return prisma.$transaction(async (tx) => {
            if (input.isDefault) {
                await tx.address.updateMany({
                    where: { userId, isDefault: true },
                    data: { isDefault: false },
                });
            }

            const hasAddress = await tx.address.findFirst({
                where: { userId },
                select: { id: true },
            });

            return tx.address.create({
                data: {
                    ...input,
                    userId,
                    // The first saved address becomes the default.
                    isDefault: input.isDefault || !hasAddress,
                },
            });
        });
    },

    async update(
        userId: string,
        addressId: string,
        input: UpdateAddressInput,
    ) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.address.findFirst({
                where: { id: addressId, userId },
            });

            if (!existing) {
                throw notFoundError();
            }

            if (input.isDefault === true) {
                await tx.address.updateMany({
                    where: { userId, isDefault: true },
                    data: { isDefault: false },
                });
            }

            const data = Object.fromEntries(
    Object.entries(input).filter(
        ([, value]) => value !== undefined,
    ),
);

return tx.address.update({
    where: { id: addressId },
    data,
});

        });
    },

    async remove(userId: string, addressId: string) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.address.findFirst({
                where: { id: addressId, userId },
            });

            if (!existing) {
                throw notFoundError();
            }

            await tx.address.delete({
                where: { id: addressId },
            });

            // If the deleted address was the default, choose
            // the most recently updated remaining address.
            if (existing.isDefault) {
                const nextAddress = await tx.address.findFirst({
                    where: { userId },
                    orderBy: { updatedAt: "desc" },
                    select: { id: true },
                });

                if (nextAddress) {
                    await tx.address.update({
                        where: { id: nextAddress.id },
                        data: { isDefault: true },
                    });
                }
            }
        });
    },

    async setDefault(userId: string, addressId: string) {
        return prisma.$transaction(async (tx) => {
            const existing = await tx.address.findFirst({
                where: { id: addressId, userId },
                select: { id: true },
            });

            if (!existing) {
                throw notFoundError();
            }

            await tx.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });

            return tx.address.update({
                where: { id: addressId },
                data: { isDefault: true },
            });
        });
    },
};
