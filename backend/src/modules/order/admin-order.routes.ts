import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/authorization.middleware.js";
import {
    getAdminOrders,
    getAdminOrderById,
    updateOrderStatus,
    cancelOrder,
} from "./order.controller.js";

const router = Router();

router.get(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    getAdminOrders,
);

router.get(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    getAdminOrderById,
);

router.post(
    "/:id/cancel",
    requireAuth,
    requireRole("ADMIN"),
    cancelOrder,
);

router.patch(
    "/:id/status",
    requireAuth,
    requireRole("ADMIN"),
    updateOrderStatus,
);



export default router;