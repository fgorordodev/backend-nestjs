import {
    INestApplication,
    VersioningType,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from '../app.config';

export function configureHttp(
    app: INestApplication,
    config: ConfigType<typeof appConfig>,
): void {
    app.setGlobalPrefix(config.apiPrefix);

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: config.apiVersion,
    });
}