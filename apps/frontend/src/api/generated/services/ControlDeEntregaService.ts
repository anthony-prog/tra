/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegistrarEntregaDto } from '../models/RegistrarEntregaDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ControlDeEntregaService {
    /**
     * Registrar entrega completada
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static registrarEntregaControllerRegistrarEntrega(
        requestBody: RegistrarEntregaDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/control-entrega/registrar-entrega',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
}
