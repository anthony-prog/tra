/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VehiculoResponseDto } from './VehiculoResponseDto';
export type VehiculoListResponseDto = {
    /**
     * Lista de vehículos
     */
    vehiculos: Array<VehiculoResponseDto>;
    /**
     * Total de vehículos
     */
    total: number;
    /**
     * Página actual
     */
    pagina: number;
    /**
     * Elementos por página
     */
    por_pagina: number;
};

