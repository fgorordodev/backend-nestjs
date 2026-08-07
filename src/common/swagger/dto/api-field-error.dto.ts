import { ApiProperty } from '@nestjs/swagger';

export class ApiFieldErrorDto {
    @ApiProperty({
        example: 'email',
        description:
            'Campo que no superó la validación',
    })
    field!: string;

    @ApiProperty({
        type: [String],
        example: [
            'El email debe tener un formato válido',
        ],
        description:
            'Mensajes de validación del campo',
    })
    messages!: string[];
}