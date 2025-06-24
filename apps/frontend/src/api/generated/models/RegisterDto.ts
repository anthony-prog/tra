/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterDto = {
    /**
     * Nombre de usuario
     */
    nombre_usuario: string;
    /**
     * Contraseña del usuario
     */
    contrasena: string;
    /**
     * Rol del usuario
     */
    rol: RegisterDto.rol;
};
export namespace RegisterDto {
    /**
     * Rol del usuario
     */
    export enum rol {
        OPERADOR = 'operador',
        ADMIN = 'admin',
        SUPERVISOR = 'supervisor',
        MONITOR = 'monitor',
    }
}

