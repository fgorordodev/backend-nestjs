import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigType,
} from '@nestjs/config';
import {
    LoggerModule as PinoLoggerModule,
} from 'nestjs-pino';

import appConfig from '../../config/app.config';

import {
    RequestLoggingMiddleware,
} from './request-logging.middleware';
import { createPinoConfig } from './pino.cofig';

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [appConfig.KEY],
            useFactory: (
                config: ConfigType<typeof appConfig>,
            ) => createPinoConfig(config),
        }),
    ],
    providers: [
        RequestLoggingMiddleware,
    ],
    exports: [
        RequestLoggingMiddleware,
    ],
})
export class LoggingModule { }