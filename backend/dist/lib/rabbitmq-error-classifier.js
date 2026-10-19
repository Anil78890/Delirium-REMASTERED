import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
export function classifyRabbitMQError(error) {
    if (!(error instanceof AppError)) {
        return "TRANSIENT";
    }
    switch (error.code) {
        case ERROR_CODES.ORDER_NOT_FOUND:
        case ERROR_CODES.REFUND_NOT_FOUND:
        case ERROR_CODES.PAYMENT_ATTEMPT_NOT_FOUND:
            return "PERMANENT";
        default:
            return "TRANSIENT";
    }
}
//# sourceMappingURL=rabbitmq-error-classifier.js.map