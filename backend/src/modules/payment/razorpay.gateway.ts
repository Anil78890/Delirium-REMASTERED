import Razorpay from "razorpay";
import crypto from "node:crypto";
import { env } from "../../config/env.js";
import type {
  CreateGatewayOrderInput,
  CreateGatewayOrderResult,
  CreateGatewayRefundInput,
  CreateGatewayRefundResult,
  FetchGatewayPaymentResult,
  FetchGatewayRefundResult,
  PaymentGateway,
  VerifyPaymentSignatureInput,
  VerifyWebhookSignatureInput,
} from "./payment.gateway.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

export class RazorpayGateway implements PaymentGateway {
  private readonly razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(
    input: CreateGatewayOrderInput,
  ): Promise<CreateGatewayOrderResult> {
    const order = await this.razorpay.orders.create({
      amount: input.amountInPaise,
      currency: "INR",
      receipt: input.receipt,
    });

    return {
      gatewayOrderId: order.id,
      amountInPaise: Number(order.amount),
      currency: order.currency,
    };
  }

  verifyPaymentSignature(
    input: VerifyPaymentSignatureInput,
  ): boolean {
    return validatePaymentVerification(
      {
        order_id: input.gatewayOrderId,
        payment_id: input.gatewayPaymentId,
      },
      input.gatewaySignature,
      env.RAZORPAY_KEY_SECRET,
    );
  }

  verifyWebhookSignature(
    input: VerifyWebhookSignatureInput,
  ): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(input.rawBody)
      .digest("hex");

    const receivedSignature = input.webhookSignature;

    if (expectedSignature.length !== receivedSignature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf8"),
      Buffer.from(receivedSignature, "utf8"),
    );
  }

  async fetchPayment(
    gatewayPaymentId: string,
  ): Promise<FetchGatewayPaymentResult> {
    const payment =
      await this.razorpay.payments.fetch(gatewayPaymentId);

    return {
      gatewayPaymentId: payment.id,
      gatewayOrderId: payment.order_id,
      amountInPaise: Number(payment.amount),
      status: payment.status,
    };
  }


  async createRefund(
  input: CreateGatewayRefundInput,
): Promise<CreateGatewayRefundResult> {
  const credentials = Buffer.from(
    `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `https://api.razorpay.com/v1/payments/${input.gatewayPaymentId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        "X-Refund-Idempotency": input.idempotencyKey,
      },
      body: JSON.stringify({
        amount: input.amountInPaise,
        receipt: input.receipt,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
  ERROR_CODES.RAZORPAY_REFUND_CREATION_FAILED,
  "Razorpay refund failed",
  502,
);
  }

  return {
    gatewayRefundId: data.id,
    gatewayPaymentId: data.payment_id,
    amountInPaise: Number(data.amount),
    currency: data.currency,
    status: data.status,
  };
}

   async fetchRefund(
    gatewayRefundId: string,
): Promise<FetchGatewayRefundResult> {

    const credentials = Buffer.from(
        `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
    ).toString("base64");

    const response = await fetch(
        `https://api.razorpay.com/v1/refunds/${gatewayRefundId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new AppError(
  ERROR_CODES.RAZORPAY_REFUND_FETCH_FAILED,
  "Razorpay refund failed",
  502,
);
    }

    return {
        gatewayRefundId: data.id,
        gatewayPaymentId: data.payment_id,
        amountInPaise: Number(data.amount),
        currency: data.currency,
        status: data.status,
    };
}
}