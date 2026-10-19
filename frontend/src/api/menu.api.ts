import { apiClient } from "../lib/api/client";
import type {
    Category,
    MenuItem,
} from "../types/menu.types";

interface ListCategoriesResponse {
    success: boolean;
    data: {
        categories: Category[];
    };
}

interface ListMenuItemsResponse {
    success: boolean;
    data: {
        menuItems: MenuItem[];
    };
}

export async function getCategories(): Promise<Category[]> {
    const response =
        await apiClient.get<ListCategoriesResponse>(
            "/menu/categories",
        );

    return response.data.data.categories;
}

export async function getMenuItems(): Promise<MenuItem[]> {
    const response =
        await apiClient.get<ListMenuItemsResponse>(
            "/menu/",
        );

    return response.data.data.menuItems;
}