import { orderService } from "./order.service.js";
import { cancelOrderSchema, createOrderSchema, updateOrderStatusSchema, } from "./order.schema.js";
import { getRequiredParam } from "../../lib/requestParams.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
export async function createOrder(req, res) {
    const order = await orderService.createOrder(req.user.id);
    return res.status(201).json({
        success: true,
        data: {
            order,
        },
    });
}
export async function getOrders(req, res) {
    const orders = await orderService.getOrders(req.user.id);
    return res.status(200).json({
        success: true,
        data: {
            orders,
        },
    });
}
export async function getOrderById(req, res) {
    const order = await orderService.getOrderById(req.user.id, req.params.id);
    return res.status(200).json({
        success: true,
        data: {
            order,
        },
    });
}
export async function updateOrderStatus(req, res) {
    const input = updateOrderStatusSchema.parse(req.body);
    const orderId = getRequiredParam(req.params.id, "id");
    const order = await orderService.updateOrderStatus(orderId, input.status);
    return res.status(200).json({
        success: true,
        data: {
            order,
        },
    });
}
export const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAdminOrders();
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAdminOrderById = async (req, res, next) => {
    try {
        const orderId = getRequiredParam(req.params.id, "id");
        const order = await orderService.getAdminOrderById(orderId);
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
};
export async function cancelOrder(req, res, next) {
    try {
        const orderId = getRequiredParam(req.params.id, "id");
        const parsed = cancelOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Invalid cancellation request", 400);
        }
        const result = await orderService.cancelOrder(orderId, parsed.data.reason);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=order.controller.js.map