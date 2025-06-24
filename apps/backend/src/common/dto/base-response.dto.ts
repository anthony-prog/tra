import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({
    description: 'Estado de la respuesta',
    example: true,
    nullable: false,
  })
  status: boolean;

  @ApiProperty({
    description: 'Mensaje de la respuesta',
    example: 'Operación exitosa',
    nullable: false,
  })
  message: string;

  @ApiProperty({
    description: 'Datos de la respuesta',
    type: 'object',
    additionalProperties: false,
    nullable: false,
  })
  data: T;

  constructor(status: boolean, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  /**
   * Crea una instancia de BaseResponseDto con el mensaje de éxito y los datos proporcionados
   * @param message - El mensaje de éxito a incluir en la respuesta
   * @param data - Los datos a incluir en la respuesta
   * @returns Una instancia de BaseResponseDto con el mensaje de éxito y los datos proporcionados
   */
  static success<T>(message: string, data: T): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, data);
  }
}

export class EmptyResponseDto {
  @ApiProperty({
    description: 'Estado de la respuesta',
    example: true,
    nullable: false,
  })
  status: boolean;

  @ApiProperty({
    description: 'Mensaje de la respuesta',
    example: 'Operación exitosa',
    nullable: false,
  })
  message: string;

  constructor(status: boolean, message: string) {
    this.status = status;
    this.message = message;
  }

  /**
   * Crea una instancia de EmptyResponseDto con el mensaje de éxito
   * @param message - El mensaje de éxito a incluir en la respuesta
   * @returns Una instancia de EmptyResponseDto con el mensaje de éxito
   */
  static success(message: string): EmptyResponseDto {
    return new EmptyResponseDto(true, message);
  }
}
