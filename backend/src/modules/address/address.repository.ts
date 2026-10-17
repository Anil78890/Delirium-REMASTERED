
import { prisma } from "../../config/prisma.js";

export const addressRepository = {
    findAllByUserId(userId: string) {
        return prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: "desc" },
                { createdAt: "desc" },
            ],
        });
    },

    findByIdAndUserId(id: string, userId: string) {
        return prisma.address.findFirst({
            where: {
                id,
                userId,
            },
        });
    },

    create(data: {
        userId: string;
        label: string;
        recipientName: string;
        phoneNumber: string;
        addressLine: string;
        latitude: number;
        longitude: number;
        isDefault: boolean;
    }) {
        return prisma.address.create({
            data,
        });
    },

    update(id: string, userId: string, data: {
        label?: string;
        recipientName?: string;
        phoneNumber?: string;
        addressLine?: string;
        latitude?: number;
        longitude?: number;
        isDefault?: boolean;
    }) {
        return prisma.address.updateMany({
            where: {
                id,
                userId,
            },
            data,
        });
    },

    delete(id: string, userId: string) {
        return prisma.address.deleteMany({
            where: {
                id,
                userId,
            },
        });
    },

    clearDefaultForUser(userId: string) {
        return prisma.address.updateMany({
            where: {
                userId,
                isDefault: true,
            },
            data: {
                isDefault: false,
            },
        });
    },

    setDefault(id: string, userId: string) {
        return prisma.address.updateMany({
            where: {
                id,
                userId,
            },
            data: {
                isDefault: true,
            },
        });
    },
};
