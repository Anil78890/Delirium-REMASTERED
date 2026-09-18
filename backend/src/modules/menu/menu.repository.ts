import { prisma } from "../../config/prisma.js";

import type {
    CreateCategoryInput,
    UpdateCategoryInput,
    CreateMenuItemInput,
    UpdateMenuItemInput,
} from "./menu.types.js";

export const menuRepository = {
    findCategoryById(categoryId: string) {
        return prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });
    },

    findCategoryByName(name: string) {
        return prisma.category.findUnique({
            where: {
                name,
            },
        });
    },

   createCategory(data: CreateCategoryInput) {
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

   updateCategory(
    categoryId: string,
    data: UpdateCategoryInput,
) {
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

    deleteCategory(categoryId: string) {
        return prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
    },

    countMenuItemsByCategory(categoryId: string) {
        return prisma.menuItem.count({
            where: {
                categoryId,
            },
        });
    },


   findMenuItemById(menuItemId: string) {
    return prisma.menuItem.findUnique({
        where: {
            id: menuItemId,
        },
    });
},

findMenuItemByName(categoryId: string, name: string) {
    return prisma.menuItem.findUnique({
        where: {
            categoryId_name: {
                categoryId,
                name,
            },
        },
    });
},

createMenuItem(data: CreateMenuItemInput) {
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

updateMenuItem(
    menuItemId: string,
    data: UpdateMenuItemInput,
) {
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
deleteMenuItem(menuItemId: string) {
    return prisma.menuItem.delete({
        where: {
            id: menuItemId,
        },
    });
},
   
};