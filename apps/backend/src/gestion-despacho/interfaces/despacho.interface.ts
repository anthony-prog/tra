import { UUID } from 'node:crypto';

export enum EstadoRecorrido {
  EN_RUTA = 'en_ruta',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

export interface Despacho {
  id_despacho: UUID;
  id_resultado_condicion_despacho: UUID;
  fecha_despacho: Date;
  estado_recorrido: EstadoRecorrido;
  id_usuario: UUID;
  observaciones?: string;
}
