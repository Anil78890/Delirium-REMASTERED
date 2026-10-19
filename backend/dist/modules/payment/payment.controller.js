import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { paymentService } from "./payment.service.js";
import { verifyPaymentSchema } from "./payment.schema.js";
export const paymentController = {
    async initiatePayment(req, res) {
        const userId = req.user.id;
        const orderId = req.params.orderId;
        if (typeof orderId !== "string") {
            throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Invalid order ID", 400);
        }
        const result = await paymentService.initiatePayment(userId, orderId);
        res.status(201).json({
            success: true,
            data: result,
        });
    },
    async verifyPayment(req, res) {
        const userId = req.user.id;
        const parsed = verifyPaymentSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Invalid payment verification data", 400);
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = parsed.data;
        const result = await paymentService.verifyPayment(userId, razorpay_order_id, razorpay_payment_id, razorpay_signature);
        res.status(200).json({
            success: true,
            data: result,
        });
    },
};
//# sourceMappingURL=payment.controller.js.map