import { apiClient } from "../lib/api/client";

interface CreatePaymentResponse {
    success: boolean;
    data: {
        paymentId: string;
        attemptId: string;
        orderId: string;
        amountInPaise: number;
        gatewayOrderId: string;
        currency: string;
    };
}


interface VerifyPaymentResponse {
    success: boolean;
    data: {
        paymentId: string;
        orderId: string;
        status: string;
    };
}

export interface PaymentOrder {
    paymentId: string;
    attemptId: string;
    orderId: string;
    amountInPaise: number;
    gatewayOrderId: string;
    currency: string;
}

export async function createPaymentOrder(
    orderId: string,
): Promise<PaymentOrder> {
    const response =
        await apiClient.post<CreatePaymentResponse>(
            `/payment/order/${orderId}`,
        );

    return response.data.data;
}


export async function verifyPayment(
    response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    },
): Promise<VerifyPaymentResponse["data"]> {
    const result =
        await apiClient.post<VerifyPaymentResponse>(
            "/payment/verify",
            response,
        );

    return result.data.data;
}