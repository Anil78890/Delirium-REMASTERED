import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { menuRepository } from "./menu.repository.js";
export const menuService = {
    async createCategory(input) {
        const existingCategory = await menuRepository.findCategoryByName(input.name);
        if (existingCategory) {
            throw new AppError(ERROR_CODES.CATEGORY_ALREADY_EXISTS, "Category already exists", 409);
        }
        return menuRepository.createCategory(input);
    },
    async getCategoryById(categoryId) {
        const category = await menuRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError(ERROR_CODES.CATEGORY_NOT_FOUND, "Category not found", 404);
        }
        return category;
    },
    async listCategories() {
        return menuRepository.listCategories();
    },
    async updateCategory(categoryId, input) {
        const category = await menuRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError(ERROR_CODES.CATEGORY_NOT_FOUND, "Category not found", 404);
        }
        if (input.name && input.name !== category.name) {
            const existingCategory = await menuRepository.findCategoryByName(input.name);
            if (existingCategory) {
                throw new AppError(ERROR_CODES.CATEGORY_ALREADY_EXISTS, "Category already exists", 409);
            }
        }
        return menuRepository.updateCategory(categoryId, input);
    },
    async deleteCategory(categoryId) {
        const category = await menuRepository.findCategoryById(categoryId);
        if (!category) {
            throw new AppError(ERROR_CODES.CATEGORY_NOT_FOUND, "Category not found", 404);
        }
        const menuItemCount = await menuRepository.countMenuItemsByCategory(categoryId);
        if (menuItemCount > 0) {
            throw new AppError(ERROR_CODES.CATEGORY_NOT_EMPTY, "Category cannot be deleted because it contains menu items", 409);
        }
        return menuRepository.deleteCategory(categoryId);
    },
    async createMenuItem(input) {
        const category = await menuRepository.findCategoryById(input.categoryId);
        if (!category) {
            throw new AppError(ERROR_CODES.CATEGORY_NOT_FOUND, "Category not found", 404);
        }
        const existingMenuItem = await menuRepository.findMenuItemByName(input.categoryId, input.name);
        if (existingMenuItem) {
            throw new AppError(ERROR_CODES.MENU_ITEM_ALREADY_EXISTS, "Menu item already exists in this category", 409);
        }
        return menuRepository.createMenuItem(input);
    },
    async getMenuItemById(menuItemId) {
        const menuItem = await menuRepository.findMenuItemById(menuItemId);
        if (!menuItem) {
            throw new AppError(ERROR_CODES.MENU_ITEM_NOT_FOUND, "Menu item not found", 404);
        }
        return menuItem;
    },
    async listMenuItems() {
        return menuRepository.listMenuItems();
    },
    async updateMenuItem(menuItemId, input) {
        const menuItem = await menuRepository.findMenuItemById(menuItemId);
        if (!menuItem) {
            throw new AppError(ERROR_CODES.MENU_ITEM_NOT_FOUND, "Menu item not found", 404);
        }
        if (input.categoryId) {
            const category = await menuRepository.findCategoryById(input.categoryId);
            if (!category) {
                throw new AppError(ERROR_CODES.CATEGORY_NOT_FOUND, "Category not found", 404);
            }
        }
        const categoryId = input.categoryId ?? menuItem.categoryId;
        const name = input.name ?? menuItem.name;
        if (categoryId !== menuItem.categoryId ||
            name !== menuItem.name) {
            const existingMenuItem = await menuRepository.findMenuItemByName(categoryId, name);
            if (existingMenuItem &&
                existingMenuItem.id !== menuItemId) {
                throw new AppError(ERROR_CODES.MENU_ITEM_ALREADY_EXISTS, "Menu item already exists in this category", 409);
            }
        }
        return menuRepository.updateMenuItem(menuItemId, input);
    },
    async deleteMenuItem(menuItemId) {
        const menuItem = await menuRepository.findMenuItemById(menuItemId);
        if (!menuItem) {
            throw new AppError(ERROR_CODES.MENU_ITEM_NOT_FOUND, "Menu item not found", 404);
        }
        return menuRepository.deleteMenuItem(menuItemId);
    },
};
//# sourceMappingURL=menu.service.js.map