/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConductorListResponseDto } from '../models/ConductorListResponseDto';
import type { ConductorResponseDto } from '../models/ConductorResponseDto';
import type { CreateConductorDto } from '../models/CreateConductorDto';
import type { CreateVehiculoDto } from '../models/CreateVehiculoDto';
import type { EmptyResponseDto } from '../models/EmptyResponseDto';
import type { UpdateConductorDto } from '../models/UpdateConductorDto';
import type { UpdateVehiculoDto } from '../models/UpdateVehiculoDto';
import type { VehiculoListResponseDto } from '../models/VehiculoListResponseDto';
import type { VehiculoResponseDto } from '../models/VehiculoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AsignaciNDeTransporteService {
    /**
     * Crear un nuevo vehículo
     * Crea un nuevo vehículo en el sistema con toda la información requerida
     * @param requestBody Datos del vehículo a crear
     * @returns any Vehículo creado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerCreateVehiculo(
        requestBody: CreateVehiculoDto,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: VehiculoResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/asignacion-transporte/vehiculos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos inválidos o vehículo ya existe`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener todos los vehículos
     * Obtiene una lista paginada de todos los vehículos registrados
     * @param page Número de página (por defecto: 1)
     * @param limit Elementos por página (por defecto: 10)
     * @returns any Vehículos obtenidos exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerFindAllVehiculos(
        page?: number,
        limit?: number,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: VehiculoListResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asignacion-transporte/vehiculos',
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
     * Obtener un vehículo por ID
     * Obtiene la información detallada de un vehículo específico
     * @param id ID único del vehículo
     * @returns any Vehículo encontrado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerFindVehiculoById(
        id: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: VehiculoResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asignacion-transporte/vehiculos/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Vehículo no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Actualizar un vehículo
     * Actualiza la información de un vehículo existente
     * @param id ID único del vehículo
     * @param requestBody Datos del vehículo a actualizar
     * @returns any Vehículo actualizado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerUpdateVehiculo(
        id: string,
        requestBody: UpdateVehiculoDto,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: VehiculoResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/asignacion-transporte/vehiculos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos inválidos o vehículo ya existe`,
                404: `Vehículo no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Eliminar un vehículo
     * Elimina un vehículo del sistema (cambia su estado a inactivo)
     * @param id ID único del vehículo
     * @returns any Vehículo eliminado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerRemoveVehiculo(
        id: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: EmptyResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/asignacion-transporte/vehiculos/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Vehículo no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Crear un nuevo conductor
     * Crea un nuevo conductor en el sistema con toda la información requerida
     * @param requestBody Datos del conductor a crear
     * @returns any Conductor creado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerCreateConductor(
        requestBody: CreateConductorDto,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: ConductorResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/asignacion-transporte/conductores',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos inválidos o conductor ya existe`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener todos los conductores
     * Obtiene una lista paginada de todos los conductores registrados
     * @param page Número de página (por defecto: 1)
     * @param limit Elementos por página (por defecto: 10)
     * @returns any Conductores obtenidos exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerFindAllConductores(
        page?: number,
        limit?: number,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: ConductorListResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asignacion-transporte/conductores',
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
     * Obtener un conductor por ID
     * Obtiene la información detallada de un conductor específico
     * @param id ID único del conductor
     * @returns any Conductor encontrado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerFindConductorById(
        id: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: ConductorResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asignacion-transporte/conductores/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Conductor no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Actualizar un conductor
     * Actualiza la información de un conductor existente
     * @param id ID único del conductor
     * @param requestBody Datos del conductor a actualizar
     * @returns any Conductor actualizado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerUpdateConductor(
        id: string,
        requestBody: UpdateConductorDto,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: ConductorResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/asignacion-transporte/conductores/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos inválidos o conductor ya existe`,
                404: `Conductor no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Eliminar un conductor
     * Elimina un conductor del sistema (cambia su estado a inactivo)
     * @param id ID único del conductor
     * @returns any Conductor eliminado exitosamente
     * @throws ApiError
     */
    public static asignacionTransporteControllerRemoveConductor(
        id: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: EmptyResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/asignacion-transporte/conductores/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Conductor no encontrado`,
                500: `Error interno del servidor`,
            },
        });
    }
}
