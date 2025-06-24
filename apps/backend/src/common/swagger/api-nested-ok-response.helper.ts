import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Helper para documentar respuestas anidadas en Swagger.
 * @param dtos Array de DTOs desde el más externo al más interno
 * @param description Descripción opcional
 * @param dataKey Propiedad donde se anida (por defecto 'data')
 */
export function ApiDeepNestedOkResponse(
  dtos: (Type<unknown> | Type<unknown>[])[],
  description = 'Respuesta exitosa con anidamiento',
  dataKey = 'data',
) {
  // Construye el objeto schema anidado dinámicamente
  let schema: Record<string, unknown> = Array.isArray(dtos[dtos.length - 1])
    ? {
        type: 'array',
        items: {
          $ref: getSchemaPath(dtos[dtos.length - 1][0] as Type<unknown>),
        },
      }
    : { $ref: getSchemaPath(dtos[dtos.length - 1] as Type<unknown>) };

  // Anida desde el penúltimo hasta el primero
  for (let i = dtos.length - 2; i >= 0; i--) {
    schema = {
      type: 'object',
      required: ['status', 'message', dataKey],
      properties: {
        status: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operación exitosa' },
        [dataKey]: schema,
      },
    };
  }

  return applyDecorators(
    ApiExtraModels(...dtos.flat()),
    ApiOkResponse({
      description,
      schema,
    }),
  );
}
