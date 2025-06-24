import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Estado de la respuesta',
    example: true,
    nullable: false,
  })
  status: boolean;

  @ApiProperty({
    description: 'Mensaje de la respuesta',
    example: 'Operación exitosa',
    nullable: false,
  })
  message: string;

  @ApiProperty({
    description: 'Datos paginados',
    type: 'object',
    nullable: false,
    properties: {
      items: {
        type: 'array',
        items: { type: 'object' },
        description: 'Lista de elementos',
      },
      meta: {
        type: 'object',
        properties: {
          totalItems: { type: 'number', example: 100 },
          itemCount: { type: 'number', example: 10 },
          itemsPerPage: { type: 'number', example: 10 },
          totalPages: { type: 'number', example: 10 },
          currentPage: { type: 'number', example: 1 },
        },
      },
    },
  })
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };

  constructor(
    status: boolean,
    message: string,
    items: T[],
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    },
  ) {
    this.status = status;
    this.message = message;
    this.data = {
      items,
      meta,
    };
  }

  static success<T>(
    message: string,
    items: T[],
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    },
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(true, message, items, meta);
  }
}
