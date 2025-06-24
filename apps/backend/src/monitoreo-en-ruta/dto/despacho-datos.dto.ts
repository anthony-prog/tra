import { ApiProperty } from '@nestjs/swagger';
import { EstadoRecorrido } from '../../gestion-despacho/interfaces/despacho.interface';
import { UUID } from 'crypto';

export class VehiculoDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del vehículo',
  })
  id_vehiculo: UUID;

  @ApiProperty({ example: 'Hilux', description: 'Modelo del vehículo' })
  modelo: string;

  @ApiProperty({ example: 'Toyota', description: 'Marca del vehículo' })
  marca: string;

  @ApiProperty({ example: 'ABC123', description: 'Placa del vehículo' })
  placa: string;

  @ApiProperty({ example: 'Rojo', description: 'Color del vehículo' })
  color: string;

  @ApiProperty({ example: 2020, description: 'Año del vehículo' })
  año: number;

  @ApiProperty({ example: true, description: 'Estado del vehículo' })
  estado_vehiculo: boolean;

  @ApiProperty({
    example: 'https://ejemplo.com/foto.jpg',
    description: 'URL de la foto del vehículo',
  })
  foto_vehiculo: string;

  @ApiProperty({ example: '1000', description: 'Capacidad de carga en kg' })
  capacidad_carga: string;

  @ApiProperty({
    example: '80',
    description: 'Capacidad de combustible en litros',
  })
  capacidad_combustible: string;

  @ApiProperty({ example: '123456789', description: 'IMEI del GPS' })
  gps_imei: string;

  @ApiProperty({ example: true, description: 'Estado del GPS' })
  gps_estado: boolean;

  @ApiProperty({
    example: '2026-02-05T05:00:00.000Z',
    description: 'Fecha de vencimiento del SOAT',
  })
  fecha_vencimiento_soat: Date;

  @ApiProperty({ example: 'SOAT123456', description: 'Número del SOAT' })
  numero_soat: string;
}

export class ConductorDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del conductor',
  })
  id_conductor: UUID;

  @ApiProperty({ example: '12345678', description: 'DNI del conductor' })
  dni: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del conductor' })
  nombre_conductor: string;

  @ApiProperty({ example: '987654321', description: 'Teléfono del conductor' })
  telefono_conductor: string;

  @ApiProperty({
    example: 'https://ejemplo.com/foto.jpg',
    description: 'URL de la foto del conductor',
  })
  foto_conductor: string;

  @ApiProperty({
    example: 'juan@ejemplo.com',
    description: 'Email del conductor',
  })
  email_conductor: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del conductor',
  })
  fecha_nacimiento: Date;

  @ApiProperty({
    example: 'Av. Ejemplo 123',
    description: 'Dirección del conductor',
  })
  direccion_conductor: string;

  @ApiProperty({ example: 'A3', description: 'Tipo de licencia' })
  tipo_licencia: string;

  @ApiProperty({
    example: '2026-02-05T05:00:00.000Z',
    description: 'Fecha de vencimiento de la licencia',
  })
  fecha_vencimiento_licencia: Date;

  @ApiProperty({
    example: '2026-02-05T05:00:00.000Z',
    description: 'Fecha de emisión de la licencia',
  })
  fecha_emision_licencia: Date;

  @ApiProperty({ example: true, description: 'Estado del conductor' })
  estado_conductor: boolean;
}

export class CargaDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la carga',
  })
  id_carga: UUID;

  @ApiProperty({ example: 'Refrigerado', description: 'Tipo de conservación' })
  tipo_conservacion: string;

  @ApiProperty({ example: '-5', description: 'Temperatura inicial requerida' })
  rango_inicial_temperatura_requerida: string;

  @ApiProperty({ example: '5', description: 'Temperatura final requerida' })
  rango_final_temperatura_requerida: string;

  @ApiProperty({ example: '1000', description: 'Peso total en kg' })
  peso_total: string;
}

export class DespachoDatosDto {
  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'Fecha del despacho',
  })
  fecha_despacho: Date;

  @ApiProperty({ example: 'en_ruta', description: 'Estado del recorrido' })
  estado_recorrido: EstadoRecorrido;

  @ApiProperty({ type: VehiculoDto })
  vehiculo: VehiculoDto;

  @ApiProperty({ type: ConductorDto })
  conductor: ConductorDto;

  @ApiProperty({
    type: [CargaDto],
    description: 'Lista de cargas del despacho',
  })
  cargas: CargaDto[];
}
