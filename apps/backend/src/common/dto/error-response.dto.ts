import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Estado de la respuesta',
    example: false,
    nullable: false,
  })
  status: boolean;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Error interno del servidor',
    nullable: false,
  })
  message: string;

  constructor(message: string) {
    this.status = false;
    this.message = message;
  }

  /**
   * Crea una instancia de ErrorResponseDto con el mensaje de error proporcionado
   * @param message - El mensaje de error a incluir en la respuesta
   * @returns Una instancia de ErrorResponseDto con el mensaje de error
   */
  static error(message: string): ErrorResponseDto {
    return new ErrorResponseDto(message);
  }
}
