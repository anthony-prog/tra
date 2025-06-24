/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Coordenada } from './Coordenada';
export type MonitoreoDto = {
    /**
     * ID del despacho
     */
    id_despacho: string;
    /**
     * Ubicación actual
     */
    ubicacion_actual: Coordenada;
    /**
     * Velocidad
     */
    velocidad: number;
    /**
     * Temperatura de la carga
     */
    temperatura_carga: number;
    /**
     * Combustible restante
     */
    combustible_restante: number;
    /**
     * Estado del compartimento
     */
    estado_compartimento: MonitoreoDto.estado_compartimento;
    /**
     * Distancia recorrida
     */
    distancia_recorrida: number;
    /**
     * Tiempo transcurrido
     */
    tiempo_transcurrido: string;
};
export namespace MonitoreoDto {
    /**
     * Estado del compartimento
     */
    export enum estado_compartimento {
        ABIERTO = 'abierto',
        CERRADO = 'cerrado',
    }
}

