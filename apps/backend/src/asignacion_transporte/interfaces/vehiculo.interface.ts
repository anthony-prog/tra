export interface Vehiculo {
  id_vehiculo: string;
  placa: string;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  tipo_vehiculo: 'camion' | 'camioneta' | 'furgoneta';
  capacidad_carga: number;
  capacidad_combustible: number;
  estado_vehiculo: boolean;
  numero_soat: string;
  fecha_vencimiento_soat: string;
  fecha_registro: string;
  gps_imei: string;
  gps_estado: boolean;
  foto_vehiculo: string | null;
  id_usuario: string;
}

export interface VehiculoListResult {
  vehiculos: Vehiculo[];
  total: number;
  pagina: number;
  por_pagina: number;
}
