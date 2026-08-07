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
import {
  ErrorCode,
  isErrorCode,
  type ErrorCode as ErrorCodeType,
} from '../errors';

import { randomUUID } from 'node:crypto';
import { REQUEST_ID_HEADER, RequestContextService } from '../../request-context';


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

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly requestContext: RequestContextService,
  ) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();

    // Respuesta HTTP real de Express
    const httpResponse = context.getResponse();

    const status = this.getStatus(exception);

    const requestId =
      this.requestContext.getRequestId() ??
      randomUUID();

    const message = this.getMessage(
      exception,
      status,
    );

    const errors = this.getErrors(exception);

    const errorCode = this.getErrorCode(
      exception,
      status,
    );

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({
        event: 'http_request_failed',
        requestId,
        statusCode: status,
        errorCode,
        exceptionName:
          exception instanceof Error
            ? exception.name
            : 'UnknownException',
        exceptionMessage:
          exception instanceof Error
            ? exception.message
            : String(exception),
        stack:
          exception instanceof Error
            ? exception.stack
            : undefined,
      });
    }

    // Contenido JSON de nuestra API
    const body: ApiResponse<never> = {
      success: false,
      message,
      errorCode,
      requestId,
      data: null,
      ...(errors ? { errors } : {}),
    };

    httpAdapter.setHeader(
      httpResponse,
      REQUEST_ID_HEADER,
      requestId,
    );

    httpAdapter.reply(
      httpResponse,
      body,
      status,
    );
  }

  private getMessage(
    exception: unknown,
    status: number,
  ): string {

    if (
      status === HttpStatus.PAYLOAD_TOO_LARGE
    ) {
      return 'El cuerpo de la solicitud excede el tamaño máximo permitido';
    }

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

    return 'Ocurrió un error interno';
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

  private getExplicitErrorCode(
    exception: unknown,
  ): ErrorCodeType | undefined {
    if (!(exception instanceof HttpException)) {
      return undefined;
    }

    const response = exception.getResponse();

    if (
      typeof response !== 'object' ||
      response === null ||
      !('errorCode' in response)
    ) {
      return undefined;
    }

    return isErrorCode(response.errorCode)
      ? response.errorCode
      : undefined;
  }

  private getErrorCode(
    exception: unknown,
    status: number,
  ): ErrorCodeType {
    const explicitErrorCode =
      this.getExplicitErrorCode(exception);

    if (explicitErrorCode) {
      return explicitErrorCode;

    }

    if (!(exception instanceof HttpException)) {
      if (status === HttpStatus.BAD_REQUEST) {
        return ErrorCode.INVALID_REQUEST_BODY;
      }

      if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
        return ErrorCode.PAYLOAD_TOO_LARGE;
      }
    }

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;

      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;

      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;

      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;

      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;

      case HttpStatus.PAYLOAD_TOO_LARGE:
        return ErrorCode.PAYLOAD_TOO_LARGE;

      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.TOO_MANY_REQUESTS;

      case HttpStatus.SERVICE_UNAVAILABLE:
        return ErrorCode.SERVICE_UNAVAILABLE;

      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

}