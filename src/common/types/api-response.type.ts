export type ApiResponse<T> =
    | {
        success: true;
        message?: string;
        data: T;
    }
    | {
        success: false;
        message: string;
        errors?: ApiFieldError[];
        data: null;
    };

export type ApiFieldError = {
    field: string;
    messages: string[]
};