import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsNotEmpty } from 'class-validator';

enum EstadoRecorrido {
  EN_RUTA = 'en_ruta',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}
export class CreateDespachoDto {
  @ApiProperty({ description: 'ID del resultado de la condición del despacho' })
  @IsUUID()
  id_resultado_condicion_despacho: string;

  @ApiProperty({ description: 'ID del usuario que crea el despacho' })
  @IsUUID()
  id_usuario: string;

  @ApiProperty({
    description: 'Estado del recorrido',
    enum: EstadoRecorrido,
    default: EstadoRecorrido.EN_RUTA,
  })
  @IsEnum(EstadoRecorrido)
  estado_recorrido: EstadoRecorrido = EstadoRecorrido.EN_RUTA;

  @ApiProperty({ description: 'Observaciones del despacho', required: false })
  @IsString()
  @IsNotEmpty()
  observaciones: string;
}
