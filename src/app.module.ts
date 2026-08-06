import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ApiExceptionFilter } from './common/filters';
import { ApiResponseInterceptor } from './common/interceptors';
import { ApiValidationPipe } from './common/pipes';
import { envValidationSchema } from './config';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,

      load: [appConfig],

      validationSchema: envValidationSchema,

      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_PIPES',
      useClass: ApiValidationPipe,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ApiResponseInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: ApiExceptionFilter,
    }
  ],
})
export class AppModule { }
