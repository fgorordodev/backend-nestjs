import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { mapValidationErrors } from '../validation/map-validation-errors';
import { ErrorCode } from '../errors';

@Injectable()
export class ApiValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      stopAtFirstError: false,

      exceptionFactory: (validationErrors: ValidationError[]) => {
        return new BadRequestException({
          message: 'Los datos enviados no son válidos',
          errorCode: ErrorCode.VALIDATION_ERROR,
          errors: mapValidationErrors(validationErrors),
        });
      },
    });
  }
}
