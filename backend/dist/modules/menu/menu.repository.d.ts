import type { CreateCategoryInput, UpdateCategoryInput, CreateMenuItemInput, UpdateMenuItemInput } from "./menu.types.js";
export declare const menuRepository: {
    findCategoryById(categoryId: string): import("../../generated/prisma/models.js").Prisma__CategoryClient<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findCategoryByName(name: string): import("../../generated/prisma/models.js").Prisma__CategoryClient<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createCategory(data: CreateCategoryInput): import("../../generated/prisma/models.js").Prisma__CategoryClient<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    listCategories(): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateCategory(categoryId: string, data: UpdateCategoryInput): import("../../generated/prisma/models.js").Prisma__CategoryClient<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    deleteCategory(categoryId: string): import("../../generated/prisma/models.js").Prisma__CategoryClient<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    countMenuItemsByCategory(categoryId: string): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<number>;
    findMenuItemById(menuItemId: string): import("../../generated/prisma/models.js").Prisma__MenuItemClient<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        priceInPaise: number;
        imageUrl: string | null;
        isActive: boolean;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    findMenuItemByName(categoryId: string, name: string): import("../../generated/prisma/models.js").Prisma__MenuItemClient<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        priceInPaise: number;
        imageUrl: string | null;
        isActive: boolean;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    createMenuItem(data: CreateMenuItemInput): import("../../generated/prisma/models.js").Prisma__MenuItemClient<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        priceInPaise: number;
        imageUrl: string | null;
        isActive: boolean;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    listMenuItems(): import("../../generated/prisma/internal/prismaNamespace.js").PrismaPromise<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        priceInPaise: number;
        imageUrl: string | null;
        isActive: boolean;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateMenuItem(menuItemId: string, data: UpdateMenuItemInput): import("../../generated/prisma/models.js").Prisma__MenuItemClient<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        priceInPaise: number;
        imageUrl: string | null;
        isActive: boolean;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
    deleteMenuItem(menuItemId: string): import("../../generated/prisma/models.js").Prisma__MenuItemClient<{
        id: string;
        categoryId: string;
        name: string;
        description: string | null;
        priceInPaise: number;
        imageUrl: string | null;
        isActive: boolean;
        isAvailable: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined;
    }>;
};
//# sourceMappingURL=menu.repository.d.ts.map