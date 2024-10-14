import { Response } from 'express';

class ApiError extends Error {
    public statusCode: number;
    public data: any;
    public success: boolean;
    public errors: string[];

    constructor(
        statusCode: number,
        message = "Something went wrong",
        errors: string[] = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const sendError = (res: Response, error: ApiError): void => {
    res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors.length ? error.errors : undefined,
    });
};

const sendSuccess = (res: Response, statusCode: number, message: string, data?: any,token?:string): void => {
    res.status(statusCode).json({
        statusCode,
        success: true,
        message,
        data: data ? data : undefined,
        ...(token && { token })
    });
};

export { ApiError, sendError,sendSuccess };
