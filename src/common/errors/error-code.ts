export const ErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_REQUEST_BODY: 'INVALID_REQUEST_BODY',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',

  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export function isErrorCode(value: unknown): value is ErrorCode {
  return (
    typeof value === 'string' &&
    Object.values(ErrorCode).includes(value as ErrorCode)
  );
}
