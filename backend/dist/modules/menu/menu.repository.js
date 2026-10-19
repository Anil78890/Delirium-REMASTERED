import { prisma } from "../../config/prisma.js";
export const menuRepository = {
    findCategoryById(categoryId) {
        return prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });
    },
    findCategoryByName(name) {
        return prisma.category.findUnique({
            where: {
                name,
            },
        });
    },
    createCategory(data) {
        return prisma.category.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                displayOrder: data.displayOrder,
            },
        });
    },
    listCategories() {
        return prisma.category.findMany({
            orderBy: {
                displayOrder: "asc",
            },
        });
    },
    updateCategory(categoryId, data) {
        return prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                ...(data.name !== undefined && {
                    name: data.name,
                }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.displayOrder !== undefined && {
                    displayOrder: data.displayOrder,
                }),
                ...(data.isActive !== undefined && {
                    isActive: data.isActive,
                }),
            },
        });
    },
    deleteCategory(categoryId) {
        return prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
    },
    countMenuItemsByCategory(categoryId) {
        return prisma.menuItem.count({
            where: {
                categoryId,
            },
        });
    },
    findMenuItemById(menuItemId) {
        return prisma.menuItem.findUnique({
            where: {
                id: menuItemId,
            },
        });
    },
    findMenuItemByName(categoryId, name) {
        return prisma.menuItem.findUnique({
            where: {
                categoryId_name: {
                    categoryId,
                    name,
                },
            },
        });
    },
    createMenuItem(data) {
        return prisma.menuItem.create({
            data: {
                categoryId: data.categoryId,
                name: data.name,
                description: data.description ?? null,
                priceInPaise: data.priceInPaise,
                imageUrl: data.imageUrl ?? null,
            },
        });
    },
    listMenuItems() {
        return prisma.menuItem.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    updateMenuItem(menuItemId, data) {
        return prisma.menuItem.update({
            where: {
                id: menuItemId,
            },
            data: {
                ...(data.categoryId !== undefined && {
                    categoryId: data.categoryId,
                }),
                ...(data.name !== undefined && {
                    name: data.name,
                }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.priceInPaise !== undefined && {
                    priceInPaise: data.priceInPaise,
                }),
                ...(data.imageUrl !== undefined && {
                    imageUrl: data.imageUrl,
                }),
                ...(data.isActive !== undefined && {
                    isActive: data.isActive,
                }),
                ...(data.isAvailable !== undefined && {
                    isAvailable: data.isAvailable,
                }),
            },
        });
    },
    deleteMenuItem(menuItemId) {
        return prisma.menuItem.delete({
            where: {
                id: menuItemId,
            },
        });
    },
};
//# sourceMappingURL=menu.repository.js.map