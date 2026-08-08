import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../app.config';
import { REQUEST_ID_HEADER } from '../../request-context';

export function configureCors(
  app: INestApplication,
  config: ConfigType<typeof appConfig>,
): void {
  app.enableCors({
    origin: config.corsOrigins,
    credentials: config.corsCredentials,
    exposedHeaders: [
      REQUEST_ID_HEADER,
      'x-ratelimit-limit',
      'x-ratelimit-remaining',
      'x-ratelimit-reset',
      'retry-after',
    ],
  });
}
