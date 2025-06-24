import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'node:crypto';

export class UltimoMonitoreoDto {
  @ApiProperty({
    description: 'ID del monitoreo de ruta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_monitoreo_ruta: UUID;

  @ApiProperty({
    description: 'Ubicación actual del vehículo',
    example: { x: -77.0428, y: -12.0464 },
  })
  ubicacion_actual: {
    x: number;
    y: number;
  };
}
