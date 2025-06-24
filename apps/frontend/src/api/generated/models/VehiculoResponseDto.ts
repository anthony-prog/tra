/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VehiculoResponseDto = {
    /**
     * ID único del vehículo
     */
    id_vehiculo: string;
    /**
     * Placa del vehículo
     */
    placa: string;
    /**
     * Marca del vehículo
     */
    marca: string;
    /**
     * Modelo del vehículo
     */
    modelo: string;
    /**
     * Año del vehículo
     */
    'año': number;
    /**
     * Color del vehículo
     */
    color: string;
    /**
     * Tipo de vehículo
     */
    tipo_vehiculo: VehiculoResponseDto.tipo_vehiculo;
    /**
     * Capacidad de carga en toneladas
     */
    capacidad_carga: number;
    /**
     * Capacidad de combustible en litros
     */
    capacidad_combustible: number;
    /**
     * Estado del vehículo
     */
    estado_vehiculo: boolean;
    /**
     * Número de SOAT
     */
    numero_soat: string;
    /**
     * Fecha de vencimiento del SOAT
     */
    fecha_vencimiento_soat: string;
    /**
     * Fecha de registro
     */
    fecha_registro: string;
    /**
     * IMEI del GPS
     */
    gps_imei: string;
    /**
     * Estado del GPS
     */
    gps_estado: boolean;
    /**
     * URL de la foto del vehículo
     */
    foto_vehiculo: Record<string, any> | null;
    /**
     * ID del usuario que registró el vehículo
     */
    id_usuario: string;
};
export namespace VehiculoResponseDto {
    /**
     * Tipo de vehículo
     */
    export enum tipo_vehiculo {
        CAMION = 'camion',
        CAMIONETA = 'camioneta',
        FURGONETA = 'furgoneta',
    }
}

