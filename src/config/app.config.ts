import { registerAs } from '@nestjs/config';

export type NodeEnvironment =
    | 'development'
    | 'test'
    | 'production';

function parseCorsOrigins(value: string): string[] {
    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}

export default registerAs('app', () => ({
    environment:
        (process.env.NODE_ENV as NodeEnvironment) ??
        'development',

    port: Number(process.env.PORT ?? 3000),

    apiPrefix:
        process.env.API_PREFIX ?? 'api',

    apiVersion:
        process.env.API_VERSION ?? '1',

    corsOrigins: parseCorsOrigins(
        process.env.CORS_ORIGINS ??
        'http://localhost:3000',
    ),

    corsCredentials:
        process.env.CORS_CREDENTIALS === 'true',

    bodyLimit:
        process.env.BODY_LIMIT ?? '1mb',
}));