/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CargaDto } from './CargaDto';
import type { ConductorDto } from './ConductorDto';
import type { VehiculoDto } from './VehiculoDto';
export type DespachoDatosDto = {
    /**
     * Fecha del despacho
     */
    fecha_despacho: string;
    /**
     * Estado del recorrido
     */
    estado_recorrido: string;
    vehiculo: VehiculoDto;
    conductor: ConductorDto;
    /**
     * Lista de cargas del despacho
     */
    cargas: Array<CargaDto>;
};

