import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import menuRoutes from "../modules/menu/menu.routes.js";
import cartRoutes from "../modules/cart/cart.routes.js";
import orderRoutes from "../modules/order/order.routes.js";
import adminOrderRoutes from "../modules/order/admin-order.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/menu", menuRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/admin/order", adminOrderRoutes);
router.use("/payment", paymentRoutes);
export default router;
//# sourceMappingURL=index.js.map