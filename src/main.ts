import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './config/app.config';
import { ConfigType } from '@nestjs/config';
import {
  configureBodyParser,
  configureCors,
  configureHelmet,
  configureHttp,
  configureRequestContext,
  configureRequestLogging,
  configureShutdown,
  configureSwagger,
} from './config/bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  configureHelmet(app);

  configureRequestContext(app);
  configureRequestLogging(app);

  configureCors(app, config);
  configureBodyParser(app, config);
  configureHttp(app, config);
  configureSwagger(app,config);
  configureShutdown(app);

  await app.listen(config.port);
}
bootstrap();
