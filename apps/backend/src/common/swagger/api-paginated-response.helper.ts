import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Helper para documentar respuestas paginadas en Swagger.
 * @param dto DTO del tipo de item que se está paginando
 * @param description Descripción opcional
 */
export function ApiPaginatedResponse(
  dto: Type<unknown>,
  description = 'Respuesta paginada exitosa',
) {
  return applyDecorators(
    ApiExtraModels(dto),
    ApiOkResponse({
      description,
      schema: {
        type: 'object',
        required: ['status', 'message', 'data'],
        properties: {
          status: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operación exitosa' },
          data: {
            type: 'object',
            required: ['items', 'meta'],
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
              },
              meta: {
                type: 'object',
                required: [
                  'total',
                  'page',
                  'limit',
                  'totalPages',
                  'hasNextPage',
                  'hasPreviousPage',
                ],
                properties: {
                  total: { type: 'number', example: 100 },
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  totalPages: { type: 'number', example: 10 },
                  hasNextPage: { type: 'boolean', example: false },
                  hasPreviousPage: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
      },
    }),
  );
}
