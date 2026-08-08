import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiExceptionFilter } from './common/filters';
import { ApiResponseInterceptor } from './common/interceptors';
import { ApiValidationPipe } from './common/pipes';
import { envValidationSchema } from './config';
import { ConfigModule } from '@nestjs/config';
import { RequestContextModule } from './request-context/request-context.module';
import appConfig from './config/app.config';
import { LoggingModule } from './common/logging/logging.module';

import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { RateLimitModule } from './common/rate-limit/rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,

      load: [appConfig],

      validationSchema: envValidationSchema,

      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    RequestContextModule,
    LoggingModule,
    HealthModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ApiValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter,
    },
  ],
})
export class AppModule {}
