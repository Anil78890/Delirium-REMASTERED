export interface RefundRequestedEvent {
    refundId: string;
    paymentId: string;
    orderId: string;
    amountInPaise: number;
}