import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ErrorCode, type ErrorCode as ErrorCodeType } from '../../errors';
import { ApiFieldErrorDto } from './api-field-error.dto';

export class ApiErrorResponseDto {
  @ApiProperty({
    enum: [false],
    example: false,
  })
  success!: false;

  @ApiProperty({
    example: 'Los datos enviados no son válidos',
  })
  message!: string;

  @ApiProperty({
    enum: Object.values(ErrorCode),
    enumName: 'ErrorCode',
    example: ErrorCode.VALIDATION_ERROR,
  })
  errorCode!: ErrorCodeType;

  @ApiProperty({
    format: 'uuid',
    example: '6426e820-d545-4d33-a11e-a93c762df7e0',
  })
  requestId!: string;

  @ApiPropertyOptional({
    type: () => [ApiFieldErrorDto],
    description: 'Errores específicos de campos cuando corresponde',
  })
  errors?: ApiFieldErrorDto[];

  @ApiProperty({
    type: 'object',
    nullable: true,
    additionalProperties: false,
    example: null,
    description: 'En las respuestas de error siempre es null',
  })
  data!: null;
}
