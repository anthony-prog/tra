/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StopDto } from './StopDto';
import type { TiempoEstimado } from './TiempoEstimado';
export type DespachoDto = {
    /**
     * ID único del despacho
     */
    id_despacho: string;
    /**
     * Fecha y hora del despacho
     */
    fecha_despacho: string;
    /**
     * Estado del recorrido
     */
    estado_recorrido: DespachoDto.estado_recorrido;
    /**
     * Tiempo total estimado del recorrido
     */
    tiempo_total_estimado: TiempoEstimado;
    /**
     * Array de paradas del despacho
     */
    stops: Array<StopDto>;
    /**
     * Total de paradas en el recorrido
     */
    total_paradas: string;
    /**
     * Placa del vehículo
     */
    placa_vehiculo: string;
    /**
     * Tipo de vehículo
     */
    tipo_vehiculo: string;
    /**
     * Modelo del vehículo
     */
    modelo: string;
    /**
     * Nombre del conductor
     */
    nombre_conductor: string;
    /**
     * Teléfono del conductor
     */
    telefono_conductor: string;
    /**
     * Tipo de conservación de la carga
     */
    tipo_conservacion: string;
    /**
     * Ubicación de origen
     */
    ubicacion_origen: string;
    /**
     * Peso total de la carga
     */
    peso_total: string;
};
export namespace DespachoDto {
    /**
     * Estado del recorrido
     */
    export enum estado_recorrido {
        EN_RUTA = 'en_ruta',
        COMPLETADO = 'completado',
        CANCELADO = 'cancelado',
    }
}

