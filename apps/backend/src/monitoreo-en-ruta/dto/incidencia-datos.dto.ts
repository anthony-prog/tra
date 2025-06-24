import { ApiProperty } from '@nestjs/swagger';
import {
  EstadoIncidencia,
  Severidad,
  TipoIncidencia,
} from '../interfaces/incidencia.interface';
import { EstadoCompartimento } from '../interfaces/monitoreo-ruta.interface';
import { Coordenada, TiempoEstimado } from './punto-ruta.dto';

export class IncidenciaDatosDto {
  @ApiProperty({
    example: '2024-03-20T10:00:00Z',
    description: 'Fecha de registro de la incidencia',
  })
  fecha_registro: Date;

  @ApiProperty({
    example: 'temperatura',
    description: 'Tipo de incidencia',
    enum: TipoIncidencia,
  })
  tipo_incidencia: TipoIncidencia;

  @ApiProperty({
    example: 'alta',
    description: 'Severidad de la incidencia',
    enum: Severidad,
  })
  severidad: Severidad;

  @ApiProperty({
    example: 'La temperatura ha superado el límite permitido',
    description: 'Descripción de la incidencia',
  })
  descripcion: string;

  @ApiProperty({
    example: 'pendiente',
    description: 'Estado de la incidencia',
    enum: EstadoIncidencia,
  })
  estado_incidencia: EstadoIncidencia;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario que registró la incidencia',
  })
  nombre_usuario: string;

  @ApiProperty({
    type: Coordenada,
    description: 'Ubicación actual del vehículo',
  })
  ubicacion_actual: Coordenada;

  @ApiProperty({
    example: 100,
    description: 'Velocidad del vehículo',
  })
  velocidad: number;

  @ApiProperty({
    example: 25.5,
    description: 'Temperatura de la carga',
  })
  temperatura_carga: number;

  @ApiProperty({
    example: 100,
    description: 'Combustible restante',
  })
  combustible_restante: number;

  @ApiProperty({
    example: 'cerrado',
    description: 'Estado del compartimento',
    enum: EstadoCompartimento,
  })
  estado_compartimento: EstadoCompartimento;

  @ApiProperty({
    example: 100,
    description: 'Distancia recorrida',
  })
  distancia_recorrida: number;

  @ApiProperty({
    type: TiempoEstimado,
    description: 'Tiempo transcurrido',
  })
  tiempo_transcurrido: TiempoEstimado;

  @ApiProperty({
    example: 'ABC123',
    description: 'Placa del vehículo',
  })
  placa: string;

  @ApiProperty({
    example: 'Toyota',
    description: 'Modelo del vehículo',
  })
  modelo: string;

  @ApiProperty({
    example: 'Carlos Rodríguez',
    description: 'Nombre del conductor',
  })
  nombre_conductor: string;

  @ApiProperty({
    example: '987654321',
    description: 'Teléfono del conductor',
  })
  telefono_conductor: string;
}
