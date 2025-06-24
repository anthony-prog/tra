/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserSearchDto = {
    /**
     * ID del usuario
     */
    id_usuario: string;
    /**
     * Nombre de usuario
     */
    nombre_usuario: string;
    /**
     * Rol del usuario
     */
    rol: UserSearchDto.rol;
};
export namespace UserSearchDto {
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

