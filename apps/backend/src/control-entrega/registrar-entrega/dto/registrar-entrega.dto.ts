import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarEntregaDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  idEntrega: string;

  @ApiProperty({ example: 'completada' })
  @IsString()
  @IsNotEmpty()
  estadoEntrega: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/firma123.jpg' })
  @IsString()
  @IsNotEmpty()
  firmaCliente: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/evidencia123.jpg' })
  @IsString()
  @IsNotEmpty()
  evidencia: string;

  @ApiProperty({
    example: 'Cliente no estaba presente, entrega dejada con vecino.',
  })
  @IsString()
  @IsNotEmpty()
  observaciones: string;
}
