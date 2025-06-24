import { ApiProperty } from '@nestjs/swagger';
import {
  EstadoIncidencia,
  Severidad,
  TipoIncidencia,
} from '../interfaces/incidencia.interface';

export class IncidenciaDto {
  @ApiProperty({
    description: 'ID único de la incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_incidencia: string;

  @ApiProperty({
    description: 'Fecha de registro de la incidencia',
    example: '2024-03-20T10:00:00Z',
  })
  fecha_registro: Date;

  @ApiProperty({
    description: 'Tipo de incidencia',
    enum: TipoIncidencia,
    example: TipoIncidencia.OTRO,
  })
  tipo_incidencia: TipoIncidencia;

  @ApiProperty({
    description: 'Severidad de la incidencia',
    enum: Severidad,
    example: Severidad.ALTA,
  })
  severidad: Severidad;

  @ApiProperty({
    description: 'Descripción de la incidencia',
    example: 'Velocidad excedida en 20 km/h',
  })
  descripcion: string;

  @ApiProperty({
    description: 'Estado de la incidencia',
    enum: EstadoIncidencia,
    example: EstadoIncidencia.PENDIENTE,
  })
  estado_incidencia: EstadoIncidencia;

  @ApiProperty({
    description: 'ID del monitoreo de ruta',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id_monitoreo_ruta: string;

  @ApiProperty({
    description: 'Nombre del usuario que registró la incidencia',
    example: 'Juan Pérez',
  })
  nombre_usuario: string;

  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC-123',
  })
  placa_vehiculo: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Toyota Hilux 2023',
  })
  modelo: string;

  @ApiProperty({
    description: 'Marca del vehículo',
    example: 'Toyota',
  })
  marca: string;

  @ApiProperty({
    description: 'Nombre del conductor',
    example: 'Juan Pérez',
  })
  nombre_conductor: string;

  @ApiProperty({
    description: 'Teléfono del conductor',
    example: '+51 999 888 777',
  })
  telefono_conductor: string;

  @ApiProperty({
    description: 'Ubicación actual del vehículo',
    example: { x: 10, y: 20 },
  })
  ubicacion_actual: { x: number; y: number };

  @ApiProperty({
    description: 'Timestamp del registro',
    example: '2024-03-20T10:00:00Z',
  })
  timestamp_registro: Date;
}
