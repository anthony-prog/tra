import { UUID } from 'crypto';
import { EstadoRecorrido } from '../../gestion-despacho/interfaces/despacho.interface';

export interface DespachoDatos {
  fecha_despacho: Date;
  estado_recorrido: EstadoRecorrido;
  id_vehiculo: UUID;
  modelo: string;
  marca: string;
  placa: string;
  color: string;
  año: number;
  estado_vehiculo: boolean;
  foto_vehiculo: string;
  capacidad_carga: string;
  capacidad_combustible: string;
  gps_imei: string;
  gps_estado: boolean;
  fecha_vencimiento_soat: Date;
  numero_soat: string;
  id_conductor: UUID;
  dni: string;
  nombre_conductor: string;
  telefono_conductor: string;
  foto_conductor: string;
  email_conductor: string;
  fecha_nacimiento: Date;
  direccion_conductor: string;
  tipo_licencia: string;
  fecha_vencimiento_licencia: Date;
  fecha_emision_licencia: Date;
  estado_conductor: boolean;
  id_carga: UUID;
  tipo_conservacion: string;
  rango_inicial_temperatura_requerida: string;
  rango_final_temperatura_requerida: string;
  peso_total: string;
  distancia_total_km: string;
  recorrido_total_km: string;
  tiempo_total_estimado: { minutes: number; seconds: number };
}
