import { EstadoRecorrido } from '../../gestion-despacho/interfaces/despacho.interface';
import { TiempoEstimado } from '../dto/punto-ruta.dto';

export interface VistaDespachosRow {
  id_despacho: string;
  fecha_despacho: Date;
  estado_recorrido: EstadoRecorrido;
  tiempo_total_estimado: TiempoEstimado;
  nombre_destino: string;
  nombre_ruta: string;
  orden_parada: number;
  total_paradas: string;
  placa_vehiculo: string;
  tipo_vehiculo: string;
  modelo: string;
  nombre_conductor: string;
  telefono_conductor: string;
  tipo_conservacion: string;
  ubicacion_origen: string;
  peso_total: string;
}
