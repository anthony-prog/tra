import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  IsEmail,
  Matches,
} from 'class-validator';

export enum TipoLicencia {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum Genero {
  M = 'M',
  F = 'F',
  O = 'O',
}

export class CreateConductorDto {
  @ApiProperty({
    description: 'DNI del conductor',
    example: '12345678',
    pattern: '^[0-9]{8}$',
  })
  @IsString()
  @Matches(/^[0-9]{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' })
  DNI: string;

  @ApiProperty({
    description: 'Nombre completo del conductor',
    example: 'Juan Pérez García',
    maxLength: 60,
  })
  @IsString()
  nombre_conductor: string;

  @ApiProperty({
    description: 'Teléfono del conductor',
    example: '987654321',
    pattern: '^[0-9]{9}$',
  })
  @IsString()
  @Matches(/^[0-9]{9}$/, {
    message: 'El teléfono debe tener exactamente 9 dígitos',
  })
  telefono_conductor: string;

  @ApiProperty({
    description: 'Email del conductor',
    example: 'juan.perez@email.com',
  })
  @IsEmail()
  email_conductor: string;

  @ApiProperty({
    description: 'Dirección del conductor',
    example: 'Av. Arequipa 123, Lima',
    maxLength: 120,
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion_conductor?: string;

  @ApiProperty({
    description: 'Estado del conductor',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado_conductor?: boolean;

  @ApiProperty({
    description: 'Tipo de licencia',
    enum: TipoLicencia,
    example: TipoLicencia.B,
  })
  @IsEnum(TipoLicencia)
  tipo_licencia: TipoLicencia;

  @ApiProperty({
    description: 'Fecha de emisión de la licencia',
    example: '2020-01-15',
  })
  @IsDateString()
  fecha_emision_licencia: string;

  @ApiProperty({
    description: 'Fecha de vencimiento de la licencia',
    example: '2025-01-15',
  })
  @IsDateString()
  fecha_vencimiento_licencia: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-05-20',
  })
  @IsDateString()
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'Género del conductor',
    enum: Genero,
    example: Genero.M,
  })
  @IsEnum(Genero)
  genero: Genero;

  @ApiProperty({
    description: 'URL de la foto del conductor',
    example: 'https://example.com/foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  foto_conductor?: string;

  @ApiProperty({
    description: 'ID del usuario que registra el conductor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id_usuario: string;
}

export class UpdateConductorDto {
  @ApiProperty({
    description: 'DNI del conductor',
    example: '12345678',
    pattern: '^[0-9]{8}$',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' })
  DNI?: string;

  @ApiProperty({
    description: 'Nombre completo del conductor',
    example: 'Juan Pérez García',
    maxLength: 60,
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre_conductor?: string;

  @ApiProperty({
    description: 'Teléfono del conductor',
    example: '987654321',
    pattern: '^[0-9]{9}$',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{9}$/, {
    message: 'El teléfono debe tener exactamente 9 dígitos',
  })
  telefono_conductor?: string;

  @ApiProperty({
    description: 'Email del conductor',
    example: 'juan.perez@email.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email_conductor?: string;

  @ApiProperty({
    description: 'Dirección del conductor',
    example: 'Av. Arequipa 123, Lima',
    maxLength: 120,
    required: false,
  })
  @IsOptional()
  @IsString()
  direccion_conductor?: string;

  @ApiProperty({
    description: 'Estado del conductor',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado_conductor?: boolean;

  @ApiProperty({
    description: 'Tipo de licencia',
    enum: TipoLicencia,
    example: TipoLicencia.B,
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoLicencia)
  tipo_licencia?: TipoLicencia;

  @ApiProperty({
    description: 'Fecha de emisión de la licencia',
    example: '2020-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_emision_licencia?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento de la licencia',
    example: '2025-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento_licencia?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-05-20',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiProperty({
    description: 'Género del conductor',
    enum: Genero,
    example: Genero.M,
    required: false,
  })
  @IsOptional()
  @IsEnum(Genero)
  genero?: Genero;

  @ApiProperty({
    description: 'URL de la foto del conductor',
    example: 'https://example.com/foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  foto_conductor?: string;
}

export class ConductorResponseDto {
  @ApiProperty({
    description: 'ID único del conductor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_conductor: string;

  @ApiProperty({
    description: 'DNI del conductor',
    example: '12345678',
  })
  DNI: string;

  @ApiProperty({
    description: 'Nombre completo del conductor',
    example: 'Juan Pérez García',
  })
  nombre_conductor: string;

  @ApiProperty({
    description: 'Teléfono del conductor',
    example: '987654321',
  })
  telefono_conductor: string;

  @ApiProperty({
    description: 'Email del conductor',
    example: 'juan.perez@email.com',
  })
  email_conductor: string;

  @ApiProperty({
    description: 'Dirección del conductor',
    example: 'Av. Arequipa 123, Lima',
    nullable: true,
  })
  direccion_conductor: string | null;

  @ApiProperty({
    description: 'Estado del conductor',
    example: true,
  })
  estado_conductor: boolean;

  @ApiProperty({
    description: 'Tipo de licencia',
    enum: TipoLicencia,
    example: TipoLicencia.B,
  })
  tipo_licencia: TipoLicencia;

  @ApiProperty({
    description: 'Fecha de emisión de la licencia',
    example: '2020-01-15',
  })
  fecha_emision_licencia: string;

  @ApiProperty({
    description: 'Fecha de vencimiento de la licencia',
    example: '2025-01-15',
  })
  fecha_vencimiento_licencia: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-05-20',
  })
  fecha_nacimiento: string;

  @ApiProperty({
    description: 'Fecha de registro',
    example: '2024-01-01T00:00:00.000Z',
  })
  fecha_registro: string;

  @ApiProperty({
    description: 'Género del conductor',
    enum: Genero,
    example: Genero.M,
  })
  genero: Genero;

  @ApiProperty({
    description: 'URL de la foto del conductor',
    example: 'https://example.com/foto.jpg',
    nullable: true,
  })
  foto_conductor: string | null;

  @ApiProperty({
    description: 'ID del usuario que registró el conductor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_usuario: string;
}

export class ConductorListResponseDto {
  @ApiProperty({
    description: 'Lista de conductores',
    type: [ConductorResponseDto],
  })
  conductores: ConductorResponseDto[];

  @ApiProperty({
    description: 'Total de conductores',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  pagina: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  por_pagina: number;
}
