export const REALTIME_ROOMS = {
    ADMINS: "admins",
    order: (orderId: string) => `order:${orderId}`,
} as const;