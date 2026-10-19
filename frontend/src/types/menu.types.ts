export interface Category {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MenuItem {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    priceInPaise: number;
    imageUrl: string | null;
    isActive: boolean;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}