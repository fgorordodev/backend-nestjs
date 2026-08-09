import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiSuccessResponseDto {
  @ApiProperty({
    enum: [true],
    example: true,
  })
  success!: true;

  @ApiPropertyOptional({
    example: 'Operación realizada correctamente',
  })
  message?: string;
}
