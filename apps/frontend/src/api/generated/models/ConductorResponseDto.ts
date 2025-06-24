/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ConductorResponseDto = {
    /**
     * ID único del conductor
     */
    id_conductor: string;
    /**
     * DNI del conductor
     */
    DNI: string;
    /**
     * Nombre completo del conductor
     */
    nombre_conductor: string;
    /**
     * Teléfono del conductor
     */
    telefono_conductor: string;
    /**
     * Email del conductor
     */
    email_conductor: string;
    /**
     * Dirección del conductor
     */
    direccion_conductor: Record<string, any> | null;
    /**
     * Estado del conductor
     */
    estado_conductor: boolean;
    /**
     * Tipo de licencia
     */
    tipo_licencia: ConductorResponseDto.tipo_licencia;
    /**
     * Fecha de emisión de la licencia
     */
    fecha_emision_licencia: string;
    /**
     * Fecha de vencimiento de la licencia
     */
    fecha_vencimiento_licencia: string;
    /**
     * Fecha de nacimiento
     */
    fecha_nacimiento: string;
    /**
     * Fecha de registro
     */
    fecha_registro: string;
    /**
     * Género del conductor
     */
    genero: ConductorResponseDto.genero;
    /**
     * URL de la foto del conductor
     */
    foto_conductor: Record<string, any> | null;
    /**
     * ID del usuario que registró el conductor
     */
    id_usuario: string;
};
export namespace ConductorResponseDto {
    /**
     * Tipo de licencia
     */
    export enum tipo_licencia {
        A = 'A',
        B = 'B',
        C = 'C',
    }
    /**
     * Género del conductor
     */
    export enum genero {
        M = 'M',
        F = 'F',
        O = 'O',
    }
}

