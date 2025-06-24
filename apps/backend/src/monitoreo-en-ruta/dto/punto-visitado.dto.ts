import { ApiProperty } from '@nestjs/swagger';
import { Coordenada } from './punto-ruta.dto';

export class PuntoVisitadoDto {
  @ApiProperty({ example: 1, description: 'Orden de la parada' })
  orden_parada: number;

  @ApiProperty({
    example: 'Tienda 1',
    description: 'Nombre del punto de entrega',
  })
  nombre_punto: string;

  @ApiProperty({
    type: Coordenada,
    description: 'Coordenadas del punto de entrega',
  })
  coordenada_punto: Coordenada;

  @ApiProperty({
    example: true,
    description: 'Indica si el punto ya fue visitado',
  })
  visitado: boolean;
}
