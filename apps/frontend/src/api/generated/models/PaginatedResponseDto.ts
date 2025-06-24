/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaginatedResponseDto = {
    /**
     * Estado de la respuesta
     */
    status: boolean;
    /**
     * Mensaje de la respuesta
     */
    message: string;
    /**
     * Datos paginados
     */
    data: {
        /**
         * Lista de elementos
         */
        items?: Array<Record<string, any>>;
        meta?: {
            totalItems?: number;
            itemCount?: number;
            itemsPerPage?: number;
            totalPages?: number;
            currentPage?: number;
        };
    };
};

