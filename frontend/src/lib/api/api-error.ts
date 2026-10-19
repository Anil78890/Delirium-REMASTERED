export class ApiError extends Error {
    statusCode: number;
    code: string | undefined;
    data: unknown;

    constructor(
        message: string,
        statusCode: number,
        data: unknown,
        code?: string,
    ) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;
        this.data = data;
    }
}