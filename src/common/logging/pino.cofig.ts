import { randomUUID } from 'node:crypto';
import type {
    ServerResponse,
} from 'node:http';

import { ConfigType } from '@nestjs/config';
import type {
    Params,
} from 'nestjs-pino';

import appConfig from '../../config/app.config';
import {
    REQUEST_ID_HEADER,
} from '../../request-context';
import { RequestMethod } from '@nestjs/common';

function getResponseRequestId(
    response: ServerResponse,
): string | undefined {
    const requestId = response.getHeader(
        REQUEST_ID_HEADER,
    );

    return typeof requestId === 'string'
        ? requestId
        : undefined;
}

export function createPinoConfig(
    config: ConfigType<typeof appConfig>,
): Params {
    return {
        forRoutes: [
            {
                path: '{*path}',
                method: RequestMethod.ALL,
            },
        ],

        pinoHttp: {
            level: config.logging.level,
            base: {
                service: config.name,
                environment: config.environment,
                version: config.version,
            },

            autoLogging: false,

            quietReqLogger: true,
            quietResLogger: true,

            genReqId: (_request, response) => {
                const existingRequestId =
                    getResponseRequestId(response);

                if (existingRequestId) {
                    return existingRequestId;
                }

                const requestId = randomUUID();

                response.setHeader(
                    REQUEST_ID_HEADER,
                    requestId,
                );

                return requestId;
            },

            customAttributeKeys: {
                reqId: 'requestId',
            },

            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'res.headers["set-cookie"]',
                    'authorization',
                    'cookie',
                    'password',
                    'token',
                    'secret',
                    '*.password',
                    '*.token',
                    '*.secret',
                ],
                censor: '[REDACTED]',
            },

            transport:
                config.environment === 'development'
                    ? {
                        target: 'pino-pretty',
                        options: {
                            colorize: true,
                            singleLine: true,
                            translateTime:
                                'SYS:standard',
                            ignore: 'pid,hostname',
                        },
                    }
                    : undefined,
        },
    };
}