import { registerAs } from '@nestjs/config';

export type NodeEnvironment = 'development' | 'test' | 'production';

function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default registerAs('app', () => ({
  environment: (process.env.NODE_ENV as NodeEnvironment) ?? 'development',

  port: Number(process.env.PORT ?? 3000),

  apiPrefix: process.env.API_PREFIX ?? 'api',

  apiVersion: process.env.API_VERSION ?? '1',

  corsOrigins: parseCorsOrigins(
    process.env.CORS_ORIGINS ?? 'http://localhost:3000',
  ),

  corsCredentials: process.env.CORS_CREDENTIALS === 'true',

  bodyLimit: process.env.BODY_LIMIT ?? '1mb',

  trustIncomingRequestId: process.env.TRUST_INCOMING_REQUEST_ID === 'true',

  trustProxy: process.env.TRUST_PROXY?.trim() || false,

  rateLimit: {
    ttlMs: Number(process.env.RATE_LIMIT_TTL_MS ?? 60_000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX ?? 100),
  },

  logging: {
    level:
      process.env.LOG_LEVEL ??
      (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  },

  name: process.env.APP_NAME ?? 'backend-base',
  version: process.env.APP_VERSION ?? '0.0.0',
}));
