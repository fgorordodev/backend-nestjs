import { Module } from '@nestjs/common';

import { RequestLoggingMiddleware } from './request-logging.middleware';

@Module({
    providers: [RequestLoggingMiddleware],
    exports: [RequestLoggingMiddleware],
})
export class LoggingModule { }