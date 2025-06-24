import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SolucionIncidenciaDto {
  @ApiPropertyOptional({
    description:
      'ID del usuario que resuelve la incidencia. Si no se proporciona, se usa el usuario autenticado',
    required: false,
    example: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @ApiProperty({
    description: 'Descripción de la solución aplicada',
    example: 'Se realizó mantenimiento preventivo al vehículo',
  })
  @IsNotEmpty()
  @IsString()
  descripcion_solucion: string;

  @ApiPropertyOptional({
    description: 'Costo de la solución en moneda local',
    example: 150.5,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  costo_solucion?: number;

  @ApiPropertyOptional({
    description: 'Tiempo que tomó resolver la incidencia',
    example: '2 hours 30 minutes',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  tiempo_resolucion?: string;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales sobre la solución',
    example: 'Se recomienda realizar mantenimiento preventivo cada 3 meses',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
