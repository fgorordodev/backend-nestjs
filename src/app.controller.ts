import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiSuccessResponse } from './common/swagger';
import { ErrorCode } from './common/errors';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiTags('App')
  @Get()
  @ApiSuccessResponse({
    model: String,
    description:
      'Comprueba que la aplicación está funcionando',
  })
  @ApiErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'Se produjo un error interno no controlado',
    errorCode:
      ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Ocurrió un error interno',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
