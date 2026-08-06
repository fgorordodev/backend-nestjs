import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import {
  ApiFieldError,
  ApiResponse,
} from '../types/api-response.type';

function isApiFieldErrorArray(
  value: unknown,
): value is ApiFieldError[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'field' in item &&
        typeof item.field === 'string' &&
        'messages' in item &&
        Array.isArray(item.messages) &&
        item.messages.every(
          (message) => typeof message === 'string',
        ),
    )
  );
}

@Injectable()
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();

    const status = this.getStatus(exception);

    const message = this.getMessage(exception, status);
    const errors = this.getErrors(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error
          ? exception.stack
          : String(exception),
      );
    }

    const response: ApiResponse<never> = {
      success: false,
      message,
      data: null,
      ...(errors ? { errors } : {}),
    };

    httpAdapter.reply(
      context.getResponse(),
      response,
      status,
    );
  }

  private getMessage(
    exception: unknown,
    status: number,
  ): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const message = response.message;

        return Array.isArray(message)
          ? message.join(', ')
          : String(message);
      }

      return exception.message;
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'El cuerpo de la solicitud no es válido';

      case HttpStatus.PAYLOAD_TOO_LARGE:
        return 'El cuerpo de la solicitud excede el tamaño máximo permitido';

      default:
        return 'Ocurrió un error interno';
    }
  }

  private getErrors(
    exception: unknown,
  ): ApiFieldError[] | undefined {
    if (!(exception instanceof HttpException)) {
      return undefined;
    }

    const response = exception.getResponse();

    if (
      typeof response !== 'object' ||
      response === null ||
      !('errors' in response)
    ) {
      return undefined;
    }

    return isApiFieldErrorArray(response.errors)
      ? response.errors
      : undefined;
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (
      typeof exception === 'object' &&
      exception !== null
    ) {
      const status =
        'status' in exception
          ? exception.status
          : 'statusCode' in exception
            ? exception.statusCode
            : undefined;

      if (
        typeof status === 'number' &&
        status >= 400 &&
        status <= 599
      ) {
        return status;
      }
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}