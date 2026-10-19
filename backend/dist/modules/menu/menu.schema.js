import { z } from "zod";
export const createCategorySchema = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(500).optional(),
    displayOrder: z.number().int().nonnegative(),
});
export const updateCategorySchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    displayOrder: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
});
export const createMenuItemSchema = z.object({
    categoryId: z.string().uuid(),
    name: z.string().trim().min(1).max(150),
    description: z.string().trim().max(1000).optional(),
    priceInPaise: z.number().int().positive(),
    imageUrl: z.string().url().optional(),
});
export const updateMenuItemSchema = z.object({
    categoryId: z.string().uuid().optional(),
    name: z.string().trim().min(1).max(150).optional(),
    description: z.string().trim().max(1000).optional(),
    priceInPaise: z.number().int().positive().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
});
//# sourceMappingURL=menu.schema.js.map