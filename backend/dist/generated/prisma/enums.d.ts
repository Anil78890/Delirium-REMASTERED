export declare const UserRole: {
    readonly CUSTOMER: 'CUSTOMER';
    readonly ADMIN: 'ADMIN';
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const OrderStatus: {
    readonly PENDING: 'PENDING';
    readonly CONFIRMED: 'CONFIRMED';
    readonly PREPARING: 'PREPARING';
    readonly READY: 'READY';
    readonly OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY';
    readonly DELIVERED: 'DELIVERED';
    readonly CANCELLED: 'CANCELLED';
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const PaymentStatus: {
    readonly PENDING: 'PENDING';
    readonly SUCCESS: 'SUCCESS';
    readonly FAILED: 'FAILED';
    readonly REFUNDED: 'REFUNDED';
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const PaymentGateway: {
    readonly RAZORPAY: 'RAZORPAY';
};
export type PaymentGateway = (typeof PaymentGateway)[keyof typeof PaymentGateway];
export declare const PaymentAttemptStatus: {
    readonly CREATED: 'CREATED';
    readonly SUCCESS: 'SUCCESS';
    readonly FAILED: 'FAILED';
};
export type PaymentAttemptStatus = (typeof PaymentAttemptStatus)[keyof typeof PaymentAttemptStatus];
export declare const OutboxEventStatus: {
    readonly PENDING: 'PENDING';
    readonly PROCESSING: 'PROCESSING';
    readonly PUBLISHED: 'PUBLISHED';
    readonly FAILED: 'FAILED';
};
export type OutboxEventStatus = (typeof OutboxEventStatus)[keyof typeof OutboxEventStatus];
export declare const RefundStatus: {
    readonly PENDING: 'PENDING';
    readonly PROCESSING: 'PROCESSING';
    readonly SUCCESS: 'SUCCESS';
    readonly FAILED: 'FAILED';
};
export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus];
//# sourceMappingURL=enums.d.ts.map