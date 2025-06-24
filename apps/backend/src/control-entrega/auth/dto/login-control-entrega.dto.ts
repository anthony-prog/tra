import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginControlEntregaDto {
  @ApiProperty({
    description: 'Nombre de usuario del repartidor',
    example: 'repartidor1',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Contraseña del repartidor',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
