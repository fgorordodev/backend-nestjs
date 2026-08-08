import {
  INestApplication,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../app.config';

export function configureHttp(
  app: INestApplication,
  config: ConfigType<typeof appConfig>,
): void {
  app.setGlobalPrefix(config.apiPrefix, {
    exclude: [
      {
        path: 'health/live',
        method: RequestMethod.GET,
      },
      {
        path: 'health/ready',
        method: RequestMethod.GET,
      },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.apiVersion,
  });
}
