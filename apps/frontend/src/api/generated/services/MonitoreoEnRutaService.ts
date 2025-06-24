/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateIncidenciaDto } from '../models/CreateIncidenciaDto';
import type { DespachoDatosDto } from '../models/DespachoDatosDto';
import type { DespachoDto } from '../models/DespachoDto';
import type { EmptyResponseDto } from '../models/EmptyResponseDto';
import type { IncidenciaDatosDto } from '../models/IncidenciaDatosDto';
import type { IncidenciaDto } from '../models/IncidenciaDto';
import type { IncidenciaRelacionadaDto } from '../models/IncidenciaRelacionadaDto';
import type { MonitoreoDto } from '../models/MonitoreoDto';
import type { PuntoRutaDto } from '../models/PuntoRutaDto';
import type { PuntoVisitadoDto } from '../models/PuntoVisitadoDto';
import type { SolucionIncidenciaDto } from '../models/SolucionIncidenciaDto';
import type { UltimoMonitoreoDto } from '../models/UltimoMonitoreoDto';
import type { UpdateIncidenciaDto } from '../models/UpdateIncidenciaDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MonitoreoEnRutaService {
    /**
     * Suscripción a datos de monitoreo
     * Endpoint SSE (Server-Sent Events) para recibir actualizaciones en tiempo real de un despacho específico.
     * @param despachoId
     * @returns any Conexión SSE establecida correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerMonitoreoEnTiempoReal(
        despachoId: string,
    ): CancelablePromise<{
        data: MonitoreoDto;
        type: string;
        id: string;
        retry: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/monitoreo/{despachoId}',
            path: {
                'despachoId': despachoId,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener despachos con paginación
     * Obtiene los despachos paginados con ordenamiento por fecha de creación
     * @param page
     * @param limit
     * @returns any Despachos obtenidos correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetDespachosPaginados(
        page: number,
        limit: number,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: {
            items: Array<DespachoDto>;
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/despachos',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener el último monitoreo de un despacho
     * Obtiene el último monitoreo de un despacho
     * @param despachoId
     * @returns any Último monitoreo obtenido correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetUltimoMonitoreo(
        despachoId: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: UltimoMonitoreoDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/ultimo-monitoreo/{despachoId}',
            path: {
                'despachoId': despachoId,
            },
            errors: {
                404: `No se encontró el despacho o no tiene monitoreos registrados`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Crear una incidencia
     * Crea una incidencia
     * @param requestBody
     * @returns EmptyResponseDto Incidencia creada correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerCreateIncidencia(
        requestBody: CreateIncidenciaDto,
    ): CancelablePromise<EmptyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/monitoreo-ruta/incidencia',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Actualizar el estado de una incidencia
     * Actualiza el estado de una incidencia
     * @param incidenciaId
     * @param requestBody
     * @returns EmptyResponseDto Incidencia actualizada correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerUpdateIncidenciaState(
        incidenciaId: string,
        requestBody: UpdateIncidenciaDto,
    ): CancelablePromise<EmptyResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/monitoreo-ruta/incidencia/{incidenciaId}',
            path: {
                'incidenciaId': incidenciaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Solucionar una incidencia
     * Soluciona una incidencia
     * @param incidenciaId
     * @param requestBody
     * @returns EmptyResponseDto Incidencia solucionada correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerSolucionarIncidencia(
        incidenciaId: string,
        requestBody: SolucionIncidenciaDto,
    ): CancelablePromise<EmptyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/monitoreo-ruta/solucionar-incidencia/{incidenciaId}',
            path: {
                'incidenciaId': incidenciaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener incidencias con paginación
     * Obtiene las incidencias paginadas con ordenamiento por fecha de registro
     * @param page
     * @param limit
     * @returns any Incidencias obtenidas correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetIncidenciasPaginadas(
        page: number,
        limit: number,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: {
            items: Array<IncidenciaDto>;
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/incidencias',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener datos básicos de un despacho
     * Obtiene los datos básicos de un despacho específico
     * @param despachoId
     * @returns any Datos básicos del despacho obtenidos correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetDespachoDatos(
        despachoId: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: DespachoDatosDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/despachos/{despachoId}',
            path: {
                'despachoId': despachoId,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener puntos de la ruta de un despacho
     * Obtiene los puntos de la ruta de un despacho específico
     * @param despachoId
     * @returns any Puntos de la ruta obtenidos correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetPuntosRuta(
        despachoId: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: Array<PuntoRutaDto>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/despachos/{despachoId}/puntos-ruta',
            path: {
                'despachoId': despachoId,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener puntos visitados de un despacho
     * Obtiene los puntos visitados de un despacho específico
     * @param despachoId
     * @returns any Puntos visitados obtenidos correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetPuntosVisitados(
        despachoId: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: Array<PuntoVisitadoDto>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/despachos/{despachoId}/puntos-visitados',
            path: {
                'despachoId': despachoId,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener una incidencia
     * Obtiene una incidencia específica
     * @param incidenciaId
     * @returns any Incidencia obtenida correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetIncidenciaDatos(
        incidenciaId: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: IncidenciaDatosDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/incidencias/{incidenciaId}',
            path: {
                'incidenciaId': incidenciaId,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener el historial de una incidencia
     * Obtiene el historial de una incidencia específica
     * @param incidenciaId
     * @returns any Historial de la incidencia obtenido correctamente
     * @throws ApiError
     */
    public static monitoreoEnRutaControllerGetHistorialIncidencia(
        incidenciaId: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: Array<IncidenciaRelacionadaDto>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/monitoreo-ruta/incidencias/{incidenciaId}/relacionada',
            path: {
                'incidenciaId': incidenciaId,
            },
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
}
