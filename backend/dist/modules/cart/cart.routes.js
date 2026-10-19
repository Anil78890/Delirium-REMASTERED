import { Router } from "express";
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart, } from "./cart.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
const router = Router();
router.use(requireAuth);
router.get("/", getCart);
router.post("/items", addCartItem);
router.patch("/items/:id", updateCartItem);
router.delete("/items/:id", removeCartItem);
router.delete("/", clearCart);
export default router;
//# sourceMappingURL=cart.routes.js.map