/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Coordenada } from './Coordenada';
import type { TiempoEstimado } from './TiempoEstimado';
export type PuntoRutaDto = {
    /**
     * Orden de la parada
     */
    orden_parada: number;
    /**
     * Nombre del punto de origen
     */
    nombre_origen: string;
    /**
     * Coordenadas del punto de origen
     */
    coordenada_origen: Coordenada;
    /**
     * Nombre del punto de destino
     */
    nombre_destino: string;
    /**
     * Coordenadas del punto de destino
     */
    coordenada_destino: Coordenada;
    /**
     * Nombre de la ruta
     */
    nombre_ruta: string;
    /**
     * Recorrido en kilómetros
     */
    recorrido_km: string;
    /**
     * Distancia en kilómetros
     */
    distancia_km: string;
    /**
     * Tiempo estimado de recorrido
     */
    tiempo_estimado: TiempoEstimado;
    /**
     * Ruta planificada con puntos intermedios
     */
    ruta_planificada: Array<Coordenada>;
};

