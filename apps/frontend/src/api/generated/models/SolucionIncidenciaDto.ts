/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SolucionIncidenciaDto = {
    /**
     * ID del usuario que resuelve la incidencia. Si no se proporciona, se usa el usuario autenticado
     */
    id_usuario?: string | null;
    /**
     * Descripción de la solución aplicada
     */
    descripcion_solucion: string;
    /**
     * Costo de la solución en moneda local
     */
    costo_solucion?: number | null;
    /**
     * Tiempo que tomó resolver la incidencia
     */
    tiempo_resolucion?: string | null;
    /**
     * Observaciones adicionales sobre la solución
     */
    observaciones?: string | null;
};

