import { UUID } from 'node:crypto';

export enum TipoIncidencia {
  ACCIDENTE = 'accidente',
  AVERIA_VEHICULO = 'averia_vehiculo',
  DESVIO_RUTA = 'desvio_ruta',
  PROBLEMA_TEMPERATURA = 'problema_temperatura',
  RETRASO = 'retraso',
  CLIMA_ADVERSO = 'clima_adverso',
  PROBLEMA_TRAFICO = 'problema_trafico',
  APERTURA_NO_AUTORIZADA = 'apertura_no_autorizada',
  OTRO = 'otro',
}

export enum Severidad {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica',
}

export enum EstadoIncidencia {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  RESUELTA = 'resuelta',
}

export interface Incidencia {
  id_incidencia: UUID;
  id_monitoreo_ruta: UUID;
  tipo_incidencia: TipoIncidencia;
  severidad: Severidad;
  descripcion: string;
  estado_incidencia: EstadoIncidencia;
  id_usuario: UUID;
  fecha_registro: Date;
}
