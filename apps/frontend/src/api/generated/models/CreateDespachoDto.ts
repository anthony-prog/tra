/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateDespachoDto = {
    /**
     * ID del resultado de la condición del despacho
     */
    id_resultado_condicion_despacho: string;
    /**
     * ID del usuario que crea el despacho
     */
    id_usuario: string;
    /**
     * Estado del recorrido
     */
    estado_recorrido: CreateDespachoDto.estado_recorrido;
    /**
     * Observaciones del despacho
     */
    observaciones?: string;
};
export namespace CreateDespachoDto {
    /**
     * Estado del recorrido
     */
    export enum estado_recorrido {
        EN_RUTA = 'en_ruta',
        COMPLETADA = 'completada',
        CANCELADA = 'cancelada',
    }
}

