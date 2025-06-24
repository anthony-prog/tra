import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID, IsNotEmpty } from 'class-validator';

// Enum local o importado desde un archivo centralizado
export enum TipoAccion {
  REASIGNAR_VEHICULO = 'reasignar_vehiculo',
  REASIGNAR_CONDUCTOR = 'reasignar_conductor',
  MOVER_CARGA = 'mover_carga',
  REPROGRAMAR = 'reprogramar',
  CANCELAR = 'cancelar',
}

export enum EstadoAccion {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

export class CreateRechazoDespachoDto {
  @ApiProperty({ description: 'ID del resultado de la condición del despacho' })
  @IsUUID()
  id_resultado_condicion_despacho: string;

  @ApiProperty({
    description: 'ID del usuario que crea el rechazo de despacho',
  })
  @IsUUID()
  id_usuario: string;

  @ApiProperty({
    description: 'Motivo del rechazo',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  motivo_rechazo: string;

  @ApiProperty({
    description: 'Tipo de acción a realizar',
    enum: TipoAccion,
  })
  @IsEnum(TipoAccion)
  tipo_accion: TipoAccion;

  @ApiProperty({
    description: 'Estado actual de la acción',
    enum: EstadoAccion,
    default: EstadoAccion.PENDIENTE,
    required: false,
  })
  @IsEnum(EstadoAccion)
  estado_accion: EstadoAccion = EstadoAccion.PENDIENTE;
}
