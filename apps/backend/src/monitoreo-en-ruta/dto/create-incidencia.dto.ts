import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'node:crypto';
import { TipoIncidencia, Severidad } from '../interfaces/incidencia.interface';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateIncidenciaDto {
  @ApiProperty({
    description: 'ID del monitoreo de ruta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  id_monitoreo_ruta: UUID;

  @ApiProperty({
    description: 'Tipo de incidencia',
    enum: TipoIncidencia,
    example: TipoIncidencia.OTRO,
  })
  @IsNotEmpty()
  @IsEnum(TipoIncidencia)
  tipo_incidencia: TipoIncidencia;

  @ApiProperty({
    description: 'Severidad de la incidencia',
    enum: Severidad,
    example: Severidad.ALTA,
  })
  @IsNotEmpty()
  @IsEnum(Severidad)
  severidad: Severidad;

  @ApiProperty({
    description: 'Descripción de la incidencia',
    example: 'Velocidad excedida en 20 km/h',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;
}
