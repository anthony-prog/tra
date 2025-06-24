/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TiempoEstimado } from './TiempoEstimado';
export type IncidenciaRelacionadaDto = {
    /**
     * ID de la incidencia relacionada
     */
    id_incidencia: string;
    /**
     * Fecha de registro de la incidencia
     */
    fecha_registro: string;
    /**
     * Tipo de incidencia
     */
    tipo_incidencia: IncidenciaRelacionadaDto.tipo_incidencia;
    /**
     * Descripción de la incidencia
     */
    descripcion: string;
    /**
     * Tipo de relación encontrada
     */
    tipo_relacion: string;
    /**
     * Tiempo transcurrido desde el registro de la incidencia
     */
    tiempo_transcurrido: TiempoEstimado;
};
export namespace IncidenciaRelacionadaDto {
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
}

