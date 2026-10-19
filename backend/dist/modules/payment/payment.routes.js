import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
const router = Router();
router.post("/order/:orderId", requireAuth, paymentController.initiatePayment);
router.post("/verify", requireAuth, paymentController.verifyPayment);
export default router;
//# sourceMappingURL=payment.routes.js.map