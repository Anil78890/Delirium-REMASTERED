import type { CreateCategoryInput, UpdateCategoryInput, CreateMenuItemInput, UpdateMenuItemInput } from "./menu.types.js";
export declare const menuService: {
    createCategory(input: CreateCategoryInput): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCategoryById(categoryId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listCategories(): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateCategory(categoryId: string, input: UpdateCategoryInput): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCategory(categoryId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        displayOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createMenuItem(input: CreateMenuItemInput): Promise<{
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
    }>;
    getMenuItemById(menuItemId: string): Promise<{
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
    }>;
    listMenuItems(): Promise<{
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
    updateMenuItem(menuItemId: string, input: UpdateMenuItemInput): Promise<{
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
    }>;
    deleteMenuItem(menuItemId: string): Promise<{
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
    }>;
};
//# sourceMappingURL=menu.service.d.ts.map