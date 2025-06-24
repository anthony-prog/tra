/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrdenesPendientesResponseDto } from '../models/OrdenesPendientesResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ControlDeEntregaRdenesPendientesService {
    /**
     * Obtener órdenes pendientes de un usuario
     * Obtiene todas las órdenes de entrega pendientes para un usuario específico
     * @param idUsuario ID único del usuario
     * @returns any Órdenes pendientes obtenidas exitosamente
     * @throws ApiError
     */
    public static ordenesPendientesControllerObtenerOrdenesPendientes(
        idUsuario: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: OrdenesPendientesResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/control-entrega/ordenes-pendientes/{idUsuario}',
            path: {
                'idUsuario': idUsuario,
            },
            errors: {
                400: `ID de usuario inválido o formato incorrecto`,
                404: `Usuario no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
}
