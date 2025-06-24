/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IncidenciaDto = {
    /**
     * ID único de la incidencia
     */
    id_incidencia: string;
    /**
     * Fecha de registro de la incidencia
     */
    fecha_registro: string;
    /**
     * Tipo de incidencia
     */
    tipo_incidencia: IncidenciaDto.tipo_incidencia;
    /**
     * Severidad de la incidencia
     */
    severidad: IncidenciaDto.severidad;
    /**
     * Descripción de la incidencia
     */
    descripcion: string;
    /**
     * Estado de la incidencia
     */
    estado_incidencia: IncidenciaDto.estado_incidencia;
    /**
     * ID del monitoreo de ruta
     */
    id_monitoreo_ruta: string;
    /**
     * Nombre del usuario que registró la incidencia
     */
    nombre_usuario: string;
    /**
     * Placa del vehículo
     */
    placa_vehiculo: string;
    /**
     * Modelo del vehículo
     */
    modelo: string;
    /**
     * Marca del vehículo
     */
    marca: string;
    /**
     * Nombre del conductor
     */
    nombre_conductor: string;
    /**
     * Teléfono del conductor
     */
    telefono_conductor: string;
    /**
     * Ubicación actual del vehículo
     */
    ubicacion_actual: Record<string, any>;
    /**
     * Timestamp del registro
     */
    timestamp_registro: string;
};
export namespace IncidenciaDto {
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
    /**
     * Estado de la incidencia
     */
    export enum estado_incidencia {
        PENDIENTE = 'pendiente',
        EN_PROCESO = 'en_proceso',
        RESUELTA = 'resuelta',
    }
}

