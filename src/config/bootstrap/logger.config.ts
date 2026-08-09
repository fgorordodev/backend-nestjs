import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../app.config';

export function createApplicationLogger(
  config: ConfigType<typeof appConfig>,
): LoggerService {
  const isProduction = config.environment === 'production';

  return new ConsoleLogger({
    json: isProduction,
    colors: !isProduction,
    compact: true,
    logLevels: isProduction
      ? ['log', 'warn', 'error', 'fatal']
      : ['log', 'warn', 'error', 'fatal', 'debug', 'verbose'],
  });
}
