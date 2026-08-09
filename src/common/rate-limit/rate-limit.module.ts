import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import appConfig from '../../config/app.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => ({
        throttlers: [
          {
            ttl: config.rateLimit.ttlMs,
            limit: config.rateLimit.maxRequests,
          },
        ],
        errorMessage: 'Demasiadas solicitudes. Inténtalo nuevamente más tarde',
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
