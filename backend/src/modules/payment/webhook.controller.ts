import type { Request, Response } from "express";

import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";

import { RazorpayGateway } from "./razorpay.gateway.js";
import { razorpayOrderPaidWebhookSchema } from "./payment.schema.js";

import { webhookRepository } from "./webhook.repository.js";
import { paymentRepository } from "./payment.repository.js";

import { paymentService } from "./payment.service.js";

const paymentGateway = new RazorpayGateway();

export const paymentWebhookController = {

  


  async handleRazorpayWebhook(
    req: Request,
    res: Response,
  ) {

    /*
     * --------------------------------------------------
     * 1. Validate raw body
     * --------------------------------------------------
     */

    if (!Buffer.isBuffer(req.body)) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid webhook body",
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 2. Read webhook signature
     * --------------------------------------------------
     */

    const webhookSignature =
      req.header("X-Razorpay-Signature");

    if (!webhookSignature) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Missing webhook signature",
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 3. Verify webhook signature
     * --------------------------------------------------
     */

    const isValidSignature =
      paymentGateway.verifyWebhookSignature({
        rawBody: req.body,
        webhookSignature,
      });

    if (!isValidSignature) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid webhook signature",
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 4. Parse JSON
     * --------------------------------------------------
     */

    let rawPayload: unknown;

    try {
      rawPayload = JSON.parse(
        req.body.toString("utf8"),
      );
    } catch {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid webhook JSON",
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 5. Validate webhook structure
     * --------------------------------------------------
     */

    const parsed =
      razorpayOrderPaidWebhookSchema.safeParse(
        rawPayload,
      );

    if (!parsed.success) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid Razorpay webhook payload",
        400,
      );
    }

    const payload = parsed.data;

    /*
     * --------------------------------------------------
     * 6. Get Razorpay event ID
     * --------------------------------------------------
     */

    const eventId =
      req.header("X-Razorpay-Event-Id");

    if (!eventId) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Missing webhook event ID",
        400,
      );
    }

    /*
     * --------------------------------------------------
     * 7. Idempotency check
     * --------------------------------------------------
     */

    let webhookEvent =
      await webhookRepository.findByProviderAndEventId(
        "RAZORPAY",
        eventId,
      );

    /*
     * Already successfully processed.
     */
    if (webhookEvent?.processedAt) {
      res.status(200).json({
        success: true,
      });

      return;
    }

    /*
     * --------------------------------------------------
     * 8. Persist webhook event
     * --------------------------------------------------
     */

    if (!webhookEvent) {
      try {
        webhookEvent =
          await webhookRepository.create({
            provider: "RAZORPAY",
            eventId,
            eventType: payload.event,
            payload,
          });
      } catch (error) {
        /*
         * Another concurrent request may have inserted
         * the same event.
         *
         * Re-read it.
         */
        const existingEvent =
          await webhookRepository.findByProviderAndEventId(
            "RAZORPAY",
            eventId,
          );

        if (!existingEvent) {
          throw error;
        }

        webhookEvent = existingEvent;

        if (webhookEvent.processedAt) {
          res.status(200).json({
            success: true,
          });

          return;
        }
      }
    }

    /*
     * --------------------------------------------------
     * 9. Extract gateway data
     * --------------------------------------------------
     */

    const razorpayOrder =
      payload.payload.order.entity;

    const razorpayPayment =
      payload.payload.payment.entity;

    /*
     * --------------------------------------------------
     * 10. Validate webhook consistency
     * --------------------------------------------------
     */

    if (
      razorpayPayment.order_id !==
      razorpayOrder.id
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Webhook payment does not belong to webhook order",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 11. Find our payment attempt
     * --------------------------------------------------
     */

   

const attempt =
  await paymentRepository.findAttemptByGatewayOrderId(razorpayOrder.id);



if (!attempt) {
  throw new AppError(
    ERROR_CODES.PAYMENT_ATTEMPT_NOT_FOUND,
    "Payment attempt not found",
    404,
  );
}

    /*
     * --------------------------------------------------
     * 12. Verify gateway order ID
     * --------------------------------------------------
     */

    if (
      attempt.gatewayOrderId !==
      razorpayOrder.id
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Webhook order does not match payment attempt",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 13. Verify order amount
     * --------------------------------------------------
     */

    if (
      attempt.payment.amountInPaise !==
      razorpayOrder.amount
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Webhook order amount does not match payment record",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 14. Verify payment amount
     * --------------------------------------------------
     */

    if (
      attempt.payment.amountInPaise !==
      razorpayPayment.amount
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Webhook payment amount does not match payment record",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 15. Independently fetch payment from Razorpay
     * --------------------------------------------------
     */

    const gatewayPayment =
      await paymentGateway.fetchPayment(
        razorpayPayment.id,
      );

    /*
     * --------------------------------------------------
     * 16. Verify gateway payment ID
     * --------------------------------------------------
     */

    if (
      gatewayPayment.gatewayPaymentId !==
      razorpayPayment.id
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Gateway payment ID does not match webhook payment",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 17. Verify gateway order
     * --------------------------------------------------
     */

    if (
      gatewayPayment.gatewayOrderId !==
      attempt.gatewayOrderId
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Gateway payment does not belong to payment attempt",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 18. Verify gateway amount
     * --------------------------------------------------
     */

    if (
      gatewayPayment.amountInPaise !==
      attempt.payment.amountInPaise
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Gateway payment amount does not match payment record",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 19. Verify captured status
     * --------------------------------------------------
     */

    if (
      gatewayPayment.status !== "captured"
    ) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Gateway payment has not been captured",
        409,
      );
    }

    /*
     * --------------------------------------------------
     * 20. Mark payment successful
     * --------------------------------------------------
     */

    await paymentService.markPaymentSuccessful({
      paymentId: attempt.paymentId,
      paymentAttemptId: attempt.id,
      orderId: attempt.payment.orderId,
      amountInPaise:
        attempt.payment.amountInPaise,
      gatewayPaymentId:
        gatewayPayment.gatewayPaymentId,
      gatewaySignature: undefined,
    });

    /*
     * --------------------------------------------------
     * 21. Mark webhook processed
     * --------------------------------------------------
     */

    await webhookRepository.markProcessed(
      webhookEvent.id,
    );

    /*
     * --------------------------------------------------
     * 22. Acknowledge Razorpay
     * --------------------------------------------------
     */

    res.status(200).json({
      success: true,
    });
  },
};