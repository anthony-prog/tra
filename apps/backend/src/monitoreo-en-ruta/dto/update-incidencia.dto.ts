import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoIncidencia } from '../interfaces/incidencia.interface';

export class UpdateIncidenciaDto {
  @ApiProperty({
    description: 'Estado de la incidencia',
    enum: EstadoIncidencia,
    example: EstadoIncidencia.EN_PROCESO,
  })
  @IsEnum(EstadoIncidencia)
  estado_incidencia: EstadoIncidencia;
}
