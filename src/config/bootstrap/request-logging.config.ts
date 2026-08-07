import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestLoggingMiddleware } from '../../common/logging/request-logging.middleware';

export function configureRequestLogging(
  app: NestExpressApplication,
): void {
  const middleware = app.get(
    RequestLoggingMiddleware,
  );

  app.use(middleware.use.bind(middleware));
}