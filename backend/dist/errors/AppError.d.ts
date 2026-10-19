export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    constructor(code: string, message: string, statusCode: number);
}
//# sourceMappingURL=AppError.d.ts.map