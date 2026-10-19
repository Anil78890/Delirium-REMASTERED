export type CreateCategoryInput = {
    name: string;
    description?: string | undefined;
    displayOrder: number;
};

export type UpdateCategoryInput = {
    name?: string | undefined;
    description?: string | undefined;
    displayOrder?: number | undefined;
    isActive?: boolean | undefined;
};

export type CreateMenuItemInput = {
    categoryId: string;
    name: string;
    description?: string | undefined;
    priceInPaise: number;
    imageUrl?: string | undefined;
};

export type UpdateMenuItemInput = {
    categoryId?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    priceInPaise?: number | undefined;
    imageUrl?: string | undefined;
    isActive?: boolean | undefined;
    isAvailable?: boolean | undefined;
};

