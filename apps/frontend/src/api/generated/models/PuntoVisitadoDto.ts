/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Coordenada } from './Coordenada';
export type PuntoVisitadoDto = {
    /**
     * Orden de la parada
     */
    orden_parada: number;
    /**
     * Nombre del punto de entrega
     */
    nombre_punto: string;
    /**
     * Coordenadas del punto de entrega
     */
    coordenada_punto: Coordenada;
    /**
     * Indica si el punto ya fue visitado
     */
    visitado: boolean;
};

