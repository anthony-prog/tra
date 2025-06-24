/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateDespachoDto } from '../models/CreateDespachoDto';
import type { CreateRechazoDespachoDto } from '../models/CreateRechazoDespachoDto';
import type { EmptyResponseDto } from '../models/EmptyResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GestionDespachoService {
    /**
     * Insertar un despacho
     * Inserta un nuevo despacho en la base de datos
     * @param requestBody Despacho a insertar
     * @returns EmptyResponseDto Despacho insertado correctamente
     * @throws ApiError
     */
    public static gestionDespachoControllerInsertarDespacho(
        requestBody: CreateDespachoDto,
    ): CancelablePromise<EmptyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/gestion-despacho',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Registrar rechazo de despacho
     * Registra un nuevo rechazo de despacho en la base de datos
     * @param requestBody Rechazo a registrar
     * @returns EmptyResponseDto Rechazo de despacho registrado correctamente
     * @throws ApiError
     */
    public static gestionDespachoControllerRegistrarRechazoDespacho(
        requestBody: CreateRechazoDespachoDto,
    ): CancelablePromise<EmptyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/gestion-despacho/rechazo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
}
