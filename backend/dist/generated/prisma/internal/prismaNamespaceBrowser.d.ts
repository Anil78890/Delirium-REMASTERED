import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: 'User';
    readonly Session: 'Session';
    readonly Category: 'Category';
    readonly MenuItem: 'MenuItem';
    readonly Cart: 'Cart';
    readonly CartItem: 'CartItem';
    readonly Order: 'Order';
    readonly OrderItem: 'OrderItem';
    readonly Payment: 'Payment';
    readonly PaymentAttempt: 'PaymentAttempt';
    readonly OutboxEvent: 'OutboxEvent';
    readonly WebhookEvent: 'WebhookEvent';
    readonly Refund: 'Refund';
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: 'ReadUncommitted';
    readonly ReadCommitted: 'ReadCommitted';
    readonly RepeatableRead: 'RepeatableRead';
    readonly Serializable: 'Serializable';
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: 'id';
    readonly email: 'email';
    readonly googleId: 'googleId';
    readonly name: 'name';
    readonly role: 'role';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SessionScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly refreshTokenHash: 'refreshTokenHash';
    readonly expiresAt: 'expiresAt';
    readonly revokedAt: 'revokedAt';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: 'id';
    readonly name: 'name';
    readonly description: 'description';
    readonly displayOrder: 'displayOrder';
    readonly isActive: 'isActive';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const MenuItemScalarFieldEnum: {
    readonly id: 'id';
    readonly categoryId: 'categoryId';
    readonly name: 'name';
    readonly description: 'description';
    readonly priceInPaise: 'priceInPaise';
    readonly imageUrl: 'imageUrl';
    readonly isActive: 'isActive';
    readonly isAvailable: 'isAvailable';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type MenuItemScalarFieldEnum = (typeof MenuItemScalarFieldEnum)[keyof typeof MenuItemScalarFieldEnum];
export declare const CartScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type CartScalarFieldEnum = (typeof CartScalarFieldEnum)[keyof typeof CartScalarFieldEnum];
export declare const CartItemScalarFieldEnum: {
    readonly id: 'id';
    readonly cartId: 'cartId';
    readonly menuItemId: 'menuItemId';
    readonly quantity: 'quantity';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type CartItemScalarFieldEnum = (typeof CartItemScalarFieldEnum)[keyof typeof CartItemScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: 'id';
    readonly userId: 'userId';
    readonly status: 'status';
    readonly subtotalInPaise: 'subtotalInPaise';
    readonly totalInPaise: 'totalInPaise';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: 'id';
    readonly orderId: 'orderId';
    readonly menuItemId: 'menuItemId';
    readonly name: 'name';
    readonly quantity: 'quantity';
    readonly unitPriceInPaise: 'unitPriceInPaise';
    readonly createdAt: 'createdAt';
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: 'id';
    readonly orderId: 'orderId';
    readonly amountInPaise: 'amountInPaise';
    readonly status: 'status';
    readonly gateway: 'gateway';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const PaymentAttemptScalarFieldEnum: {
    readonly id: 'id';
    readonly paymentId: 'paymentId';
    readonly amountInPaise: 'amountInPaise';
    readonly status: 'status';
    readonly gatewayOrderId: 'gatewayOrderId';
    readonly gatewayPaymentId: 'gatewayPaymentId';
    readonly gatewaySignature: 'gatewaySignature';
    readonly gatewayOrderCreatedAt: 'gatewayOrderCreatedAt';
    readonly gatewayOrderCreationToken: 'gatewayOrderCreationToken';
    readonly gatewayOrderCreationUntil: 'gatewayOrderCreationUntil';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type PaymentAttemptScalarFieldEnum = (typeof PaymentAttemptScalarFieldEnum)[keyof typeof PaymentAttemptScalarFieldEnum];
export declare const OutboxEventScalarFieldEnum: {
    readonly id: 'id';
    readonly eventType: 'eventType';
    readonly aggregateType: 'aggregateType';
    readonly aggregateId: 'aggregateId';
    readonly payload: 'payload';
    readonly status: 'status';
    readonly attempts: 'attempts';
    readonly availableAt: 'availableAt';
    readonly processedAt: 'processedAt';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
};
export type OutboxEventScalarFieldEnum = (typeof OutboxEventScalarFieldEnum)[keyof typeof OutboxEventScalarFieldEnum];
export declare const WebhookEventScalarFieldEnum: {
    readonly id: 'id';
    readonly provider: 'provider';
    readonly eventId: 'eventId';
    readonly eventType: 'eventType';
    readonly payload: 'payload';
    readonly processedAt: 'processedAt';
    readonly createdAt: 'createdAt';
};
export type WebhookEventScalarFieldEnum = (typeof WebhookEventScalarFieldEnum)[keyof typeof WebhookEventScalarFieldEnum];
export declare const RefundScalarFieldEnum: {
    readonly id: 'id';
    readonly paymentId: 'paymentId';
    readonly amountInPaise: 'amountInPaise';
    readonly status: 'status';
    readonly gatewayRefundId: 'gatewayRefundId';
    readonly gatewayPaymentId: 'gatewayPaymentId';
    readonly reason: 'reason';
    readonly createdAt: 'createdAt';
    readonly updatedAt: 'updatedAt';
    readonly idempotencyKey: 'idempotencyKey';
};
export type RefundScalarFieldEnum = (typeof RefundScalarFieldEnum)[keyof typeof RefundScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: 'asc';
    readonly desc: 'desc';
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: 'default';
    readonly insensitive: 'insensitive';
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: 'first';
    readonly last: 'last';
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map