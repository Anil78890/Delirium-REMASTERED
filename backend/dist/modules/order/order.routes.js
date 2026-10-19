import { Router } from "express";
import { createOrder, getOrderById, getOrders, } from "./order.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
const router = Router();
router.use(requireAuth);
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
export default router;
//# sourceMappingURL=order.routes.js.map