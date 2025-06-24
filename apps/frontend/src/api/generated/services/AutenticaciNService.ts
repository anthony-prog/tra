/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyResponseDto } from '../models/EmptyResponseDto';
import type { LoginDto } from '../models/LoginDto';
import type { LoginResponseDto } from '../models/LoginResponseDto';
import type { RegisterDto } from '../models/RegisterDto';
import type { UserProfileDto } from '../models/UserProfileDto';
import type { UserSearchDto } from '../models/UserSearchDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AutenticaciNService {
    /**
     * Registrar nuevo usuario
     * Crea un nuevo usuario con contraseña encriptada
     * @param requestBody Datos del usuario a registrar
     * @returns EmptyResponseDto Usuario registrado exitosamente
     * @throws ApiError
     */
    public static authControllerRegister(
        requestBody: RegisterDto,
    ): CancelablePromise<EmptyResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Iniciar sesión
     * Autentica un usuario y devuelve un token JWT que contiene el ID del usuario
     * @param requestBody Credenciales de acceso
     * @returns any Login exitoso - Token JWT generado
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: LoginResponseDto;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Credenciales inválidas`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Obtener perfil del usuario
     * Obtiene la información del usuario autenticado (solo admin, supervisor, operador y monitor)
     * @returns any Perfil del usuario obtenido exitosamente
     * @throws ApiError
     */
    public static authControllerGetProfile(): CancelablePromise<{
        status: boolean;
        message: string;
        data: UserProfileDto;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/profile',
            errors: {
                401: `Token inválido o expirado`,
                403: `Acceso denegado - Rol insuficiente`,
                500: `Error interno del servidor`,
            },
        });
    }
    /**
     * Buscar usuarios
     * Obtiene los primeros 10 usuarios con opción de búsqueda por nombre
     * @param search Término de búsqueda para filtrar por nombre de usuario
     * @param limit Límite de usuarios a retornar (por defecto 10)
     * @returns any Usuarios obtenidos exitosamente
     * @throws ApiError
     */
    public static authControllerSearchUsers(
        search?: string,
        limit?: string,
    ): CancelablePromise<{
        status: boolean;
        message: string;
        data: Array<UserSearchDto>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/users',
            query: {
                'search': search,
                'limit': limit,
            },
            errors: {
                401: `Token inválido o expirado`,
                403: `Acceso denegado - Rol insuficiente`,
                500: `Error interno del servidor`,
            },
        });
    }
}
