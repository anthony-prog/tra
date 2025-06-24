import { ApiProperty } from '@nestjs/swagger';
import { TipoIncidencia } from '../interfaces/incidencia.interface';
import { UUID } from 'crypto';
import { TiempoEstimado } from './punto-ruta.dto';

export class IncidenciaRelacionadaDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la incidencia relacionada',
  })
  id_incidencia: UUID;

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
    example: 'La temperatura ha superado el límite permitido',
    description: 'Descripción de la incidencia',
  })
  descripcion: string;

  @ApiProperty({
    example: 'Mismo conductor',
    description: 'Tipo de relación encontrada',
  })
  tipo_relacion: string;

  @ApiProperty({
    type: TiempoEstimado,
    description: 'Tiempo transcurrido desde el registro de la incidencia',
  })
  tiempo_transcurrido: TiempoEstimado;
}
