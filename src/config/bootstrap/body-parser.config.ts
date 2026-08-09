import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { ErrorRequestHandler } from 'express';

import { ErrorCode } from '../../common/errors';
import appConfig from '../app.config';

type BodyParserError = {
  type?: unknown;
};

function isBodyParserError(
  error: unknown,
  expectedType: string,
): error is BodyParserError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === expectedType
  );
}

const bodyParserErrorHandler: ErrorRequestHandler = (
  error,
  _request,
  _response,
  next,
): void => {
  if (isBodyParserError(error, 'entity.parse.failed')) {
    next(
      new BadRequestException({
        message: 'El cuerpo de la solicitud no es válido',
        errorCode: ErrorCode.INVALID_REQUEST_BODY,
      }),
    );

    return;
  }

  if (isBodyParserError(error, 'entity.too.large')) {
    next(
      new PayloadTooLargeException({
        message: 'El cuerpo de la solicitud excede el tamaño máximo permitido',
        errorCode: ErrorCode.PAYLOAD_TOO_LARGE,
      }),
    );

    return;
  }

  next(error);
};

export function configureBodyParser(
  app: NestExpressApplication,
  config: ConfigType<typeof appConfig>,
): void {
  app.useBodyParser('json', {
    limit: config.bodyLimit,
  });

  app.useBodyParser('urlencoded', {
    limit: config.bodyLimit,
  });

  // Debe registrarse después de los parsers.
  app.use(bodyParserErrorHandler);
}
