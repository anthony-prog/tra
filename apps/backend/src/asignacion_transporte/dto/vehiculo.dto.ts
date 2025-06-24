import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';

export enum TipoVehiculo {
  CAMION = 'camion',
  CAMIONETA = 'camioneta',
  FURGONETA = 'furgoneta',
}

export class CreateVehiculoDto {
  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC1234',
    maxLength: 7,
  })
  @IsString()
  placa: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
    maxLength: 15,
  })
  @IsString()
  marca: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Hilux',
    maxLength: 15,
  })
  @IsString()
  modelo: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2020,
    minimum: 2000,
  })
  @IsNumber()
  @Min(2000)
  año: number;

  @ApiProperty({
    description: 'Color del vehículo',
    example: 'Blanco',
    maxLength: 15,
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'Tipo de vehículo',
    enum: TipoVehiculo,
    example: TipoVehiculo.CAMIONETA,
  })
  @IsEnum(TipoVehiculo)
  tipo_vehiculo: TipoVehiculo;

  @ApiProperty({
    description: 'Capacidad de carga en toneladas',
    example: 2.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  capacidad_carga: number;

  @ApiProperty({
    description: 'Capacidad de combustible en litros',
    example: 80.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  capacidad_combustible: number;

  @ApiProperty({
    description: 'Estado del vehículo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  estado_vehiculo?: boolean;

  @ApiProperty({
    description: 'Número de SOAT',
    example: '1234567',
    maxLength: 7,
  })
  @IsString()
  numero_soat: string;

  @ApiProperty({
    description: 'Fecha de vencimiento del SOAT',
    example: '2024-12-31',
  })
  @IsDateString()
  fecha_vencimiento_soat: string;

  @ApiProperty({
    description: 'IMEI del GPS',
    example: '123456789012345',
    maxLength: 30,
  })
  @IsString()
  gps_imei: string;

  @ApiProperty({
    description: 'Estado del GPS',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  gps_estado?: boolean;

  @ApiProperty({
    description: 'URL de la foto del vehículo',
    example: 'https://example.com/foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  foto_vehiculo?: string;

  @ApiProperty({
    description: 'ID del usuario que registra el vehículo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id_usuario: string;
}

export class UpdateVehiculoDto {
  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC1234',
    maxLength: 7,
    required: false,
  })
  @IsOptional()
  @IsString()
  placa?: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
    maxLength: 15,
    required: false,
  })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Hilux',
    maxLength: 15,
    required: false,
  })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2020,
    minimum: 2000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(2000)
  año?: number;

  @ApiProperty({
    description: 'Color del vehículo',
    example: 'Blanco',
    maxLength: 15,
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Tipo de vehículo',
    enum: TipoVehiculo,
    example: TipoVehiculo.CAMIONETA,
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoVehiculo)
  tipo_vehiculo?: TipoVehiculo;

  @ApiProperty({
    description: 'Capacidad de carga en toneladas',
    example: 2.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacidad_carga?: number;

  @ApiProperty({
    description: 'Capacidad de combustible en litros',
    example: 80.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacidad_combustible?: number;

  @ApiProperty({
    description: 'Estado del vehículo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado_vehiculo?: boolean;

  @ApiProperty({
    description: 'Número de SOAT',
    example: '1234567',
    maxLength: 7,
    required: false,
  })
  @IsOptional()
  @IsString()
  numero_soat?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento del SOAT',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fecha_vencimiento_soat?: string;

  @ApiProperty({
    description: 'IMEI del GPS',
    example: '123456789012345',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  gps_imei?: string;

  @ApiProperty({
    description: 'Estado del GPS',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  gps_estado?: boolean;

  @ApiProperty({
    description: 'URL de la foto del vehículo',
    example: 'https://example.com/foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  foto_vehiculo?: string;
}

export class VehiculoResponseDto {
  @ApiProperty({
    description: 'ID único del vehículo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_vehiculo: string;

  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC1234',
  })
  placa: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
  })
  marca: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Hilux',
  })
  modelo: string;

  @ApiProperty({
    description: 'Año del vehículo',
    example: 2020,
  })
  año: number;

  @ApiProperty({
    description: 'Color del vehículo',
    example: 'Blanco',
  })
  color: string;

  @ApiProperty({
    description: 'Tipo de vehículo',
    enum: TipoVehiculo,
    example: TipoVehiculo.CAMIONETA,
  })
  tipo_vehiculo: TipoVehiculo;

  @ApiProperty({
    description: 'Capacidad de carga en toneladas',
    example: 2.5,
  })
  capacidad_carga: number;

  @ApiProperty({
    description: 'Capacidad de combustible en litros',
    example: 80.0,
  })
  capacidad_combustible: number;

  @ApiProperty({
    description: 'Estado del vehículo',
    example: true,
  })
  estado_vehiculo: boolean;

  @ApiProperty({
    description: 'Número de SOAT',
    example: '1234567',
  })
  numero_soat: string;

  @ApiProperty({
    description: 'Fecha de vencimiento del SOAT',
    example: '2024-12-31',
  })
  fecha_vencimiento_soat: string;

  @ApiProperty({
    description: 'Fecha de registro',
    example: '2024-01-01T00:00:00.000Z',
  })
  fecha_registro: string;

  @ApiProperty({
    description: 'IMEI del GPS',
    example: '123456789012345',
  })
  gps_imei: string;

  @ApiProperty({
    description: 'Estado del GPS',
    example: true,
  })
  gps_estado: boolean;

  @ApiProperty({
    description: 'URL de la foto del vehículo',
    example: 'https://example.com/foto.jpg',
    nullable: true,
  })
  foto_vehiculo: string | null;

  @ApiProperty({
    description: 'ID del usuario que registró el vehículo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_usuario: string;
}

export class VehiculoListResponseDto {
  @ApiProperty({
    description: 'Lista de vehículos',
    type: [VehiculoResponseDto],
  })
  vehiculos: VehiculoResponseDto[];

  @ApiProperty({
    description: 'Total de vehículos',
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
