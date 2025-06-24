/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateRechazoDespachoDto = {
    /**
     * ID del resultado de la condición del despacho
     */
    id_resultado_condicion_despacho: string;
    /**
     * ID del usuario que crea el rechazo de despacho
     */
    id_usuario: string;
    /**
     * Motivo del rechazo
     */
    motivo_rechazo: string;
    /**
     * Tipo de acción a realizar
     */
    tipo_accion: CreateRechazoDespachoDto.tipo_accion;
    /**
     * Estado actual de la acción
     */
    estado_accion?: CreateRechazoDespachoDto.estado_accion;
};
export namespace CreateRechazoDespachoDto {
    /**
     * Tipo de acción a realizar
     */
    export enum tipo_accion {
        REASIGNAR_VEHICULO = 'reasignar_vehiculo',
        REASIGNAR_CONDUCTOR = 'reasignar_conductor',
        MOVER_CARGA = 'mover_carga',
        REPROGRAMAR = 'reprogramar',
        CANCELAR = 'cancelar',
    }
    /**
     * Estado actual de la acción
     */
    export enum estado_accion {
        PENDIENTE = 'pendiente',
        EN_PROCESO = 'en_proceso',
        COMPLETADA = 'completada',
        CANCELADA = 'cancelada',
    }
}

