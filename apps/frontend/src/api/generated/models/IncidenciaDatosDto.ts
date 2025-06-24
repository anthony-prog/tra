/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Coordenada } from './Coordenada';
import type { TiempoEstimado } from './TiempoEstimado';
export type IncidenciaDatosDto = {
    /**
     * Fecha de registro de la incidencia
     */
    fecha_registro: string;
    /**
     * Tipo de incidencia
     */
    tipo_incidencia: IncidenciaDatosDto.tipo_incidencia;
    /**
     * Severidad de la incidencia
     */
    severidad: IncidenciaDatosDto.severidad;
    /**
     * Descripción de la incidencia
     */
    descripcion: string;
    /**
     * Estado de la incidencia
     */
    estado_incidencia: IncidenciaDatosDto.estado_incidencia;
    /**
     * Nombre del usuario que registró la incidencia
     */
    nombre_usuario: string;
    /**
     * Ubicación actual del vehículo
     */
    ubicacion_actual: Coordenada;
    /**
     * Velocidad del vehículo
     */
    velocidad: number;
    /**
     * Temperatura de la carga
     */
    temperatura_carga: number;
    /**
     * Combustible restante
     */
    combustible_restante: number;
    /**
     * Estado del compartimento
     */
    estado_compartimento: IncidenciaDatosDto.estado_compartimento;
    /**
     * Distancia recorrida
     */
    distancia_recorrida: number;
    /**
     * Tiempo transcurrido
     */
    tiempo_transcurrido: TiempoEstimado;
    /**
     * Placa del vehículo
     */
    placa: string;
    /**
     * Modelo del vehículo
     */
    modelo: string;
    /**
     * Nombre del conductor
     */
    nombre_conductor: string;
    /**
     * Teléfono del conductor
     */
    telefono_conductor: string;
};
export namespace IncidenciaDatosDto {
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
    /**
     * Estado del compartimento
     */
    export enum estado_compartimento {
        ABIERTO = 'abierto',
        CERRADO = 'cerrado',
    }
}

