/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserProfileDto = {
    /**
     * Nombre de usuario
     */
    nombre_usuario: string;
    /**
     * Rol del usuario
     */
    rol: UserProfileDto.rol;
};
export namespace UserProfileDto {
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

