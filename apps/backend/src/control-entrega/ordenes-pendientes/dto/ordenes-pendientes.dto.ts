import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class OrdenesPendientesParamsDto {
  @ApiProperty({
    description: 'ID del usuario que ha iniciado sesión',
    example: 'f4d52e10-1b34-4c6a-84aa-331f0db3d7cf',
  })
  @IsString()
  @IsUUID()
  idUsuario: string;
}
