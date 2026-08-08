import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse as SwaggerApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { type ErrorCode } from '../../errors';
import { ApiErrorResponseDto } from '../dto';

export type ApiErrorResponseOptions = {
  status: number;
  description: string;
  errorCode: ErrorCode;
  message: string;
  includeFieldErrors?: boolean;
};

export function ApiErrorResponse(
  ...responses: ApiErrorResponseOptions[]
): MethodDecorator {
  const responseDecorators = responses.map(
    ({ status, description, errorCode, message, includeFieldErrors = false }) =>
      SwaggerApiResponse({
        status,
        description,
        schema: {
          allOf: [
            {
              $ref: getSchemaPath(ApiErrorResponseDto),
            },
          ],
          example: {
            success: false,
            message,
            errorCode,
            requestId: '6426e820-d545-4d33-a11e-a93c762df7e0',
            ...(includeFieldErrors
              ? {
                  errors: [
                    {
                      field: 'email',
                      messages: ['El email debe tener un formato válido'],
                    },
                  ],
                }
              : {}),
            data: null,
          },
        },
      }),
  );

  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ...responseDecorators,
  );
}
