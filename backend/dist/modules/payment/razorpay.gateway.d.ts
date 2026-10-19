import type { CreateGatewayOrderInput, CreateGatewayOrderResult, CreateGatewayRefundInput, CreateGatewayRefundResult, FetchGatewayPaymentResult, FetchGatewayRefundResult, PaymentGateway, VerifyPaymentSignatureInput, VerifyWebhookSignatureInput } from "./payment.gateway.js";
export declare class RazorpayGateway implements PaymentGateway {
    private readonly razorpay;
    constructor();
    createOrder(input: CreateGatewayOrderInput): Promise<CreateGatewayOrderResult>;
    verifyPaymentSignature(input: VerifyPaymentSignatureInput): boolean;
    verifyWebhookSignature(input: VerifyWebhookSignatureInput): boolean;
    fetchPayment(gatewayPaymentId: string): Promise<FetchGatewayPaymentResult>;
    createRefund(input: CreateGatewayRefundInput): Promise<CreateGatewayRefundResult>;
    fetchRefund(gatewayRefundId: string): Promise<FetchGatewayRefundResult>;
}
//# sourceMappingURL=razorpay.gateway.d.ts.map