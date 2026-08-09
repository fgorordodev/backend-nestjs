import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { ConfigType } from '@nestjs/config';
import {
  configureBodyParser,
  configureCors,
  configureHelmet,
  configureHttp,
  configureProxy,
  configureRequestContext,
  configureRequestLogging,
  configureShutdown,
  configureSwagger,
} from './config/bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  app.useLogger(app.get(Logger));

  configureProxy(app, config);
  configureHelmet(app);

  configureRequestContext(app);
  configureRequestLogging(app);

  configureCors(app, config);
  configureBodyParser(app, config);
  configureHttp(app, config);
  configureSwagger(app, config);
  configureShutdown(app);

  await app.listen(config.port);
}
void bootstrap();
