import { EstadoCompartimento } from 'src/monitoreo-en-ruta/interfaces/monitoreo-ruta.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Coordenada } from './punto-ruta.dto';

export class MonitoreoDto {
  @ApiProperty({
    description: 'ID del despacho',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_despacho: string;

  @ApiProperty({
    description: 'Ubicación actual',
    type: Coordenada,
  })
  ubicacion_actual: Coordenada;

  @ApiProperty({
    description: 'Velocidad',
    example: 100,
  })
  velocidad: number;

  @ApiProperty({
    description: 'Temperatura de la carga',
    example: 20,
  })
  temperatura_carga: number;

  @ApiProperty({
    description: 'Combustible restante',
    example: 100,
  })
  combustible_restante: number;

  @ApiProperty({
    description: 'Estado del compartimento',
    enum: EstadoCompartimento,
    example: EstadoCompartimento.ABIERTO,
  })
  estado_compartimento: EstadoCompartimento;

  @ApiProperty({
    description: 'Distancia recorrida',
    example: 100,
  })
  distancia_recorrida: number;

  @ApiProperty({
    description: 'Tiempo transcurrido',
    example: '10:00:00',
  })
  tiempo_transcurrido: string;
}
