import { ApiProperty } from '@nestjs/swagger';
import { EstadoRecorrido } from '../../gestion-despacho/interfaces/despacho.interface';
import { TiempoEstimado } from './punto-ruta.dto';

export class StopDto {
  @ApiProperty({
    description: 'Nombre del punto de destino',
    example: 'Almacén Central',
  })
  nombre_destino: string;

  @ApiProperty({
    description: 'Nombre de la ruta',
    example: 'RUTA-001',
  })
  nombre_ruta: string;

  @ApiProperty({
    description: 'Orden de la parada',
    example: 1,
  })
  orden_parada: number;
}

export class DespachoDto {
  @ApiProperty({
    description: 'ID único del despacho',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_despacho: string;

  @ApiProperty({
    description: 'Fecha y hora del despacho',
    example: '2024-03-20T10:00:00Z',
  })
  fecha_despacho: Date;

  @ApiProperty({
    description: 'Estado del recorrido',
    enum: EstadoRecorrido,
    example: EstadoRecorrido.EN_RUTA,
  })
  estado_recorrido: EstadoRecorrido;

  @ApiProperty({
    description: 'Tiempo total estimado del recorrido',
    type: TiempoEstimado,
  })
  tiempo_total_estimado: TiempoEstimado;

  @ApiProperty({
    description: 'Array de paradas del despacho',
    type: [StopDto],
  })
  stops: StopDto[];

  @ApiProperty({
    description: 'Total de paradas en el recorrido',
    example: '5',
  })
  total_paradas: string;

  @ApiProperty({
    description: 'Placa del vehículo',
    example: 'ABC-123',
  })
  placa_vehiculo: string;

  @ApiProperty({
    description: 'Tipo de vehículo',
    example: 'CAMIONETA',
  })
  tipo_vehiculo: string;

  @ApiProperty({
    description: 'Modelo del vehículo',
    example: 'Toyota Hilux 2023',
  })
  modelo: string;

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
    description: 'Tipo de conservación de la carga',
    example: 'REFRIGERADO',
  })
  tipo_conservacion: string;

  @ApiProperty({
    description: 'Ubicación de origen',
    example: 'Lima, Perú',
  })
  ubicacion_origen: string;

  @ApiProperty({
    description: 'Peso total de la carga',
    example: '1000.5',
  })
  peso_total: string;
}
