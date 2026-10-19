export class AppError extends Error {
    statusCode;
    code;
    isOperational;
    constructor(code, message, statusCode) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=AppError.js.map