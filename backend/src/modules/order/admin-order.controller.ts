import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { getRequiredParam } from "../../lib/requestParams.js";
import { cancelOrderSchema } from "./order.schema.js";
import { orderService } from "./order.service.js";
import type { Request, Response, NextFunction } from "express";
export async function cancelOrder(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const orderId =
            getRequiredParam(req.params.id, "id");

        const parsed =
            cancelOrderSchema.safeParse(req.body);

        if (!parsed.success) {
            throw new AppError(
                ERROR_CODES.VALIDATION_ERROR,
                "Invalid cancellation request",
                400,
            );
        }

        const result =
            await orderService.cancelOrder(
                orderId,
                parsed.data.reason,
            );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}