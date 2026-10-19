import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "./AppError.js";
import { ERROR_CODES } from "./errorCodes.js";
export function mapPrismaError(error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        return null;
    }
    switch (error.code) {
        case "P2002":
            return new AppError(ERROR_CODES.CONFLICT, "Resource already exists", 409);
        case "P2025":
            return new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, "Resource not found", 404);
        default:
            return null;
    }
}
//# sourceMappingURL=prismaErrorMapper.js.map