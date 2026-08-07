import { ConfigType } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
    DocumentBuilder,
    SwaggerModule,
} from '@nestjs/swagger';

import appConfig from '../app.config';

export function configureSwagger(
    app: NestExpressApplication,
    config: ConfigType<typeof appConfig>,
): void {
    if (config.environment !== 'development') {
        return;
    }

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Backend Base API')
        .setDescription(
            'Documentación de la API Backend Base',
        )
        .setVersion('1.0.0')
        .build();

    const documentFactory = () =>
        SwaggerModule.createDocument(
            app,
            swaggerConfig,
        );

    SwaggerModule.setup(
        'docs',
        app,
        documentFactory,
        {
            jsonDocumentUrl: 'docs/json',
            raw: ['json'],
            customSiteTitle:
                'Backend Base API Documentation',
        },
    );
}