/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConductorResponseDto } from './ConductorResponseDto';
export type ConductorListResponseDto = {
    /**
     * Lista de conductores
     */
    conductores: Array<ConductorResponseDto>;
    /**
     * Total de conductores
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

