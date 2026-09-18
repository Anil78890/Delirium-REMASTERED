import "./realtime.types.js";
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

import { verifyAccessToken } from "../../lib/jwt.js";
import {
    REALTIME_ROOMS,
} from "./realtime.constants.js";

import { orderRepository } from "../order/order.repository.js";

export function createRealtimeServer(
    httpServer: HttpServer,
) {
    const io = new Server(httpServer, {
        cors: {
            origin: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token;

            if (
                typeof token !== "string" ||
                token.length === 0
            ) {
                return next(
                    new Error("Authentication required"),
                );
            }

            const payload =
                verifyAccessToken(token);

            socket.data.user = {
                id: payload.sub,
                role: payload.role,
            };

            next();
        } catch {
            next(
                new Error("Invalid or expired access token"),
            );
        }
    });

    io.on("connection", (socket) => {
    const user = socket.data.user;

    if (user.role === "ADMIN") {
        socket.join(REALTIME_ROOMS.ADMINS);
    }

    socket.on(
        "order:join",
        async ({ orderId }, callback) => {
            try {
                const order =
                    await orderRepository.findOrderById(
                        orderId,
                    );

                if (!order) {
                    return callback({
                        success: false,
                        message: "Order not found",
                    });
                }

                if (
                    user.role === "CUSTOMER" &&
                    order.userId !== user.id
                ) {
                    return callback({
                        success: false,
                        message: "Access denied",
                    });
                }

                await socket.join(
                    REALTIME_ROOMS.order(orderId),
                );

                callback({
                    success: true,
                });
            } catch {
                callback({
                    success: false,
                    message: "Failed to join order room",
                });
            }
        },
    );
});

    return io;
}
