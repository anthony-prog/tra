/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateConductorDto = {
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
    direccion_conductor?: string;
    /**
     * Estado del conductor
     */
    estado_conductor: boolean;
    /**
     * Tipo de licencia
     */
    tipo_licencia: CreateConductorDto.tipo_licencia;
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
     * Género del conductor
     */
    genero: CreateConductorDto.genero;
    /**
     * URL de la foto del conductor
     */
    foto_conductor?: string;
    /**
     * ID del usuario que registra el conductor
     */
    id_usuario: string;
};
export namespace CreateConductorDto {
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

