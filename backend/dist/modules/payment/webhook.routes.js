import { Router } from "express";
import express from "express";
import { paymentWebhookController } from "./webhook.controller.js";
const router = Router();
router.post("/razorpay", express.raw({ type: "application/json" }), paymentWebhookController.handleRazorpayWebhook);
export default router;
//# sourceMappingURL=webhook.routes.js.map