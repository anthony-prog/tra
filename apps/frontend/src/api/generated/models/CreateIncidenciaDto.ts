/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateIncidenciaDto = {
    /**
     * ID del monitoreo de ruta
     */
    id_monitoreo_ruta: string;
    /**
     * Tipo de incidencia
     */
    tipo_incidencia: CreateIncidenciaDto.tipo_incidencia;
    /**
     * Severidad de la incidencia
     */
    severidad: CreateIncidenciaDto.severidad;
    /**
     * Descripción de la incidencia
     */
    descripcion: string;
};
export namespace CreateIncidenciaDto {
    /**
     * Tipo de incidencia
     */
    export enum tipo_incidencia {
        ACCIDENTE = 'accidente',
        AVERIA_VEHICULO = 'averia_vehiculo',
        DESVIO_RUTA = 'desvio_ruta',
        PROBLEMA_TEMPERATURA = 'problema_temperatura',
        RETRASO = 'retraso',
        CLIMA_ADVERSO = 'clima_adverso',
        PROBLEMA_TRAFICO = 'problema_trafico',
        APERTURA_NO_AUTORIZADA = 'apertura_no_autorizada',
        OTRO = 'otro',
    }
    /**
     * Severidad de la incidencia
     */
    export enum severidad {
        BAJA = 'baja',
        MEDIA = 'media',
        ALTA = 'alta',
        CRITICA = 'critica',
    }
}

