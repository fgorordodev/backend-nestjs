import { ValidationError } from 'class-validator';

import { ApiFieldError } from '../types/api-response.type';


export function mapValidationErrors(
    validationErrors: ValidationError[],
    parentPath = '',
): ApiFieldError[] {
    return validationErrors.flatMap((error) => {
        const field = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

        const currentErrors: ApiFieldError[] = error.constraints
            ? [
                {
                    field,
                    messages: Object.values(error.constraints),
                },
            ]
            : [];

        const nestedErrors = error.children?.length
            ? mapValidationErrors(error.children, field)
            : [];

        return [...currentErrors, ...nestedErrors];
    });
}