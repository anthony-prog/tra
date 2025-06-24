/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateIncidenciaDto = {
    /**
     * Estado de la incidencia
     */
    estado_incidencia: UpdateIncidenciaDto.estado_incidencia;
};
export namespace UpdateIncidenciaDto {
    /**
     * Estado de la incidencia
     */
    export enum estado_incidencia {
        PENDIENTE = 'pendiente',
        EN_PROCESO = 'en_proceso',
        RESUELTA = 'resuelta',
    }
}

