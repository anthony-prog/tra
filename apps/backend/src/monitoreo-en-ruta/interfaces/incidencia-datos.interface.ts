import {
  EstadoIncidencia,
  Severidad,
  TipoIncidencia,
} from './incidencia.interface';
import { EstadoCompartimento } from './monitoreo-ruta.interface';

export interface IncidenciaDatos {
  fecha_registro: Date;
  tipo_incidencia: TipoIncidencia;
  severidad: Severidad;
  descripcion: string;
  estado_incidencia: EstadoIncidencia;
  nombre_usuario: string;
  ubicacion_actual: string;
  velocidad: number;
  temperatura_carga: number;
  combustible_restante: number;
  estado_compartimento: EstadoCompartimento;
  distancia_recorrida: number;
  tiempo_transcurrido: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  placa: string;
  modelo: string;
  nombre_conductor: string;
  telefono_conductor: string;
}
