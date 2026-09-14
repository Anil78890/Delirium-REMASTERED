import { prisma } from "../../lib/prisma.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import type { RefundStatus } from "../../generated/prisma/client.js";

type RefundDb = Pick<
    PrismaClient,
    "refund" | "payment"
>;

export const refundRepository = {
  findById(
    refundId: string,
    db: RefundDb = prisma,
  ) {
    return db.refund.findUnique({
      where: {
        id: refundId,
      },
    });
  },

  findByIdempotencyKey(
    idempotencyKey: string,
    db: RefundDb = prisma,
  ) {
    return db.refund.findUnique({
      where: {
        idempotencyKey,
      },
    });
  },

  findByPaymentId(
    paymentId: string,
    db: RefundDb = prisma,
  ) {
    return db.refund.findMany({
      where: {
        paymentId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  create(
    data: {
      id: string;
      paymentId: string;
      amountInPaise: number;
      gatewayPaymentId: string;
      idempotencyKey: string;
      reason?: string;
    },
    db: RefundDb = prisma,
  ) {
    return db.refund.create({
      data: {
        id: data.id,
        paymentId: data.paymentId,
        amountInPaise: data.amountInPaise,
        gatewayPaymentId: data.gatewayPaymentId,
        idempotencyKey: data.idempotencyKey,
        ...(data.reason !== undefined
          ? { reason: data.reason }
          : {}),
      },
    });
  },

  updateStatus(
    refundId: string,
    currentStatus: RefundStatus,
    newStatus: RefundStatus,
    db: RefundDb = prisma,
  ) {
    return db.refund.updateMany({
      where: {
        id: refundId,
        status: currentStatus,
      },
      data: {
        status: newStatus,
      },
    });
  },

  updateGatewayDetails(
    refundId: string,
    gatewayRefundId: string,
    db: RefundDb = prisma,
  ) {
    return db.refund.updateMany({
      where: {
        id: refundId,
        gatewayRefundId: null,
      },
      data: {
        gatewayRefundId,
      },
    });
  },

   findProcessingRefunds(db: RefundDb = prisma) {
    return db.refund.findMany({
        where: {
            status: "PROCESSING",
            gatewayRefundId: {
                not: null,
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
},
};