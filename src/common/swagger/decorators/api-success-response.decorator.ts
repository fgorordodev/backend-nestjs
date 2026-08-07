import {
  applyDecorators,
  HttpStatus,
  type Type,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ApiSuccessResponseDto } from '../dto';

export type ApiSuccessResponseOptions = {
  model: Type<unknown>;
  status?: number;
  description?: string;
  isArray?: boolean;
};

export function ApiSuccessResponse({
  model,
  status = HttpStatus.OK,
  description = 'Operación realizada correctamente',
  isArray = false,
}: ApiSuccessResponseOptions): MethodDecorator {
  const isPrimitiveModel =
    model === String ||
    model === Number ||
    model === Boolean;

  const modelSchema =
    model === String
      ? { type: 'string' as const }
      : model === Number
        ? { type: 'number' as const }
        : model === Boolean
          ? { type: 'boolean' as const }
          : {
              $ref: getSchemaPath(model),
            };

  const dataSchema = isArray
    ? {
        type: 'array' as const,
        items: modelSchema,
      }
    : modelSchema;

  const extraModels = isPrimitiveModel
    ? ApiExtraModels(ApiSuccessResponseDto)
    : ApiExtraModels(
        ApiSuccessResponseDto,
        model,
      );

  return applyDecorators(
    extraModels,
    ApiResponse({
      status,
      description,
      schema: {
        title: isArray
          ? `ApiSuccessResponseOf${model.name}Array`
          : `ApiSuccessResponseOf${model.name}`,
        allOf: [
          {
            $ref: getSchemaPath(
              ApiSuccessResponseDto,
            ),
          },
          {
            type: 'object',
            required: ['data'],
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
}