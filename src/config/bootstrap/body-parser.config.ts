import { ConfigType } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import appConfig from '../app.config';

export function configureBodyParser(
    app: NestExpressApplication,
    config: ConfigType<typeof appConfig>,
): void {
    app.useBodyParser('json', {
        limit: config.bodyLimit,
    });

    app.useBodyParser('urlencoded', {
        limit: config.bodyLimit,
    });
}