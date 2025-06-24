import { UUID } from 'node:crypto';

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

export interface RechazoDespacho {
  id_rechazo_despacho: UUID;
  id_resultado_condicion_despacho: UUID;
  id_usuario: UUID;
  fecha_rechazo: Date;
  motivo_rechazo: string;
  tipo_accion: TipoAccion;
  estado_accion: EstadoAccion;
}
