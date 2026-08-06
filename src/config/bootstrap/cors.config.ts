import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../app.config';

export function configureCors(
    app: INestApplication,
    config: ConfigType<typeof appConfig>,
): void {
    app.enableCors({
        origin: config.corsOrigins,
        credentials: config.corsCredentials,
    });
}