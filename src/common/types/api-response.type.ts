import { ErrorCode } from "../errors";

export type ApiResponse<T> =
    | {
        success: true;
        message?: string;
        data: T;
    }
    | {
        success: false;
        message: string;
        errorCode: ErrorCode;
        requestId: string;
        errors?: ApiFieldError[];
        data: null;
    };

export type ApiFieldError = {
    field: string;
    messages: string[]
};