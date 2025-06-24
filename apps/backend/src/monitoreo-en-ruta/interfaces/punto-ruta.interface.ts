export interface PuntoRutaDatos {
  orden_parada: number;
  nombre_origen: string;
  coordenada_origen: string;
  nombre_destino: string;
  coordenada_destino: string;
  nombre_ruta: string;
  recorrido_km: string;
  distancia_km: string;
  tiempo_estimado: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
  ruta_planificada: string;
}
