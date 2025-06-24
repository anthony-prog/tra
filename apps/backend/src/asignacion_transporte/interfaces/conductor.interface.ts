export interface Conductor {
  id_conductor: string;
  DNI: string;
  nombre_conductor: string;
  telefono_conductor: string;
  email_conductor: string;
  direccion_conductor: string | null;
  estado_conductor: boolean;
  tipo_licencia: 'A' | 'B' | 'C';
  fecha_emision_licencia: string;
  fecha_vencimiento_licencia: string;
  fecha_nacimiento: string;
  fecha_registro: string;
  genero: 'M' | 'F' | 'O';
  foto_conductor: string | null;
  id_usuario: string;
}

export interface ConductorListResult {
  conductores: Conductor[];
  total: number;
  pagina: number;
  por_pagina: number;
}
