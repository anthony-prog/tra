import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../interfaces/roles.interface';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  contrasena: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'nuevo_usuario',
  })
  @IsString()
  @IsNotEmpty()
  nombre_usuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  contrasena: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.OPERADOR,
  })
  @IsEnum(UserRole)
  rol: UserRole;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT generado',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  nombre_usuario: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  rol: UserRole;
}

export class UserSearchDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_usuario: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  nombre_usuario: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  rol: UserRole;
}
