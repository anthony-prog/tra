export interface OrdenPendiente {
  id_entrega: string;
  nombre_punto: string;
  coordenada_punto: string;
  fecha_entrega: string;
  total_subentregas: number;
}

export interface OrdenPendienteRow {
  id_entrega: string;
  nombre_punto: string;
  coordenada_punto: string;
  fecha_entrega: string;
  total_subentregas: string;
}
