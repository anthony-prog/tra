import { ApiProperty } from '@nestjs/swagger';

export class OrdenPendienteDto {
  @ApiProperty({
    description: 'ID único de la entrega',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_entrega: string;

  @ApiProperty({
    description: 'Nombre del punto de entrega',
    example: 'Restaurante El Buen Sabor',
  })
  nombre_punto: string;

  @ApiProperty({
    description: 'Coordenadas del punto de entrega',
    example: '(12.3456,-78.9012)',
  })
  coordenada_punto: string;

  @ApiProperty({
    description: 'Fecha de entrega programada',
    example: '2024-01-15T10:30:00.000Z',
  })
  fecha_entrega: string;

  @ApiProperty({
    description: 'Total de subentregas asociadas',
    example: 3,
  })
  total_subentregas: number;
}

export class OrdenesPendientesResponseDto {
  @ApiProperty({
    description: 'Lista de órdenes pendientes',
    type: [OrdenPendienteDto],
  })
  ordenes: OrdenPendienteDto[];

  @ApiProperty({
    description: 'Total de órdenes pendientes',
    example: 5,
  })
  total: number;
}
