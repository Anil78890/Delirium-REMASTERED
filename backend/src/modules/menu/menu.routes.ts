import { Router } from "express";

import {
    createCategory,
    getCategory,
    listCategories,
    updateCategory,
    deleteCategory,
    createMenuItem,
    getMenuItem,
    listMenuItems,
    updateMenuItem,
    deleteMenuItem,
} from "./menu.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/authorization.middleware.js";


const router = Router();


// =========================
// Categories
// =========================

// Public/authenticated read operations

router.get(
    "/categories",
    requireAuth,
    listCategories,
);

router.get(
    "/categories/:id",
    requireAuth,
    getCategory,
);


// Admin-only write operations

router.post(
    "/categories",
    requireAuth,
    requireRole("ADMIN"),
    createCategory,
);

router.patch(
    "/categories/:id",
    requireAuth,
    requireRole("ADMIN"),
    updateCategory,
);

router.delete(
    "/categories/:id",
    requireAuth,
    requireRole("ADMIN"),
    deleteCategory,
);


// =========================
// Menu Items
// =========================

// Authenticated read operations

router.get(
    "/",
    requireAuth,
    listMenuItems,
);

router.get(
    "/:id",
    requireAuth,
    getMenuItem,
);


// Admin-only write operations

router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    createMenuItem,
);

router.patch(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    updateMenuItem,
);

router.delete(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    deleteMenuItem,
);


export default router;