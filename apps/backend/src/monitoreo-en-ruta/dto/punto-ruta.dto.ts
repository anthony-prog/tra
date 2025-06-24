import { ApiProperty } from '@nestjs/swagger';

export class Coordenada {
  @ApiProperty({ example: -12.0464, description: 'Latitud' })
  lat: number;

  @ApiProperty({ example: -77.0428, description: 'Longitud' })
  lng: number;
}

export class TiempoEstimado {
  @ApiProperty({ example: 1, description: 'Días' })
  days: number;

  @ApiProperty({ example: 1, description: 'Horas' })
  hours: number;

  @ApiProperty({ example: 15, description: 'Minutos' })
  minutes: number;

  @ApiProperty({ example: 30, description: 'Segundos' })
  seconds: number;

  @ApiProperty({ example: 30, description: 'Milisegundos' })
  milliseconds: number;
}

export class PuntoRutaDto {
  @ApiProperty({ example: 1, description: 'Orden de la parada' })
  orden_parada: number;

  @ApiProperty({
    example: 'Almacén Central',
    description: 'Nombre del punto de origen',
  })
  nombre_origen: string;

  @ApiProperty({
    type: Coordenada,
    description: 'Coordenadas del punto de origen',
  })
  coordenada_origen: Coordenada;

  @ApiProperty({
    example: 'Tienda 1',
    description: 'Nombre del punto de destino',
  })
  nombre_destino: string;

  @ApiProperty({
    type: Coordenada,
    description: 'Coordenadas del punto de destino',
  })
  coordenada_destino: Coordenada;

  @ApiProperty({ example: 'Ruta Principal', description: 'Nombre de la ruta' })
  nombre_ruta: string;

  @ApiProperty({ example: '10.5', description: 'Recorrido en kilómetros' })
  recorrido_km: string;

  @ApiProperty({ example: '8.2', description: 'Distancia en kilómetros' })
  distancia_km: string;

  @ApiProperty({
    type: TiempoEstimado,
    description: 'Tiempo estimado de recorrido',
  })
  tiempo_estimado: TiempoEstimado;

  @ApiProperty({
    type: [Coordenada],
    description: 'Ruta planificada con puntos intermedios',
  })
  ruta_planificada: Coordenada[];
}
