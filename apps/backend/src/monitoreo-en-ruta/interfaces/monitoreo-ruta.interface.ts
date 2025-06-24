import { UUID } from 'node:crypto';

export enum EstadoCompartimento {
  ABIERTO = 'abierto',
  CERRADO = 'cerrado',
}

export interface MonitoreoRuta {
  id_monitoreo_ruta: UUID;
  id_despacho: UUID;
  ubicacion_actual: { x: number; y: number }; // Para el tipo POINT de PostgreSQL
  velocidad: number;
  temperatura_carga?: number;
  combustible_restante: number;
  estado_compartimento: EstadoCompartimento;
  timestamp_registro: Date;
  distancia_recorrida: number;
  tiempo_transcurrido: string; // Para el tipo INTERVAL de PostgreSQL
}
