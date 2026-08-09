import { ConfigType } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import appConfig from '../app.config';

export function configureProxy(
  app: NestExpressApplication,
  config: ConfigType<typeof appConfig>,
): void {
  app.set('trust proxy', config.trustProxy);
}
