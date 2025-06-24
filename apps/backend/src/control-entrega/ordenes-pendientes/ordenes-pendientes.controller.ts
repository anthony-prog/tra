import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { OrdenesPendientesService } from './ordenes-pendientes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdenesPendientesResponseDto } from './dto/orden-pendiente.dto';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { ApiDeepNestedOkResponse } from '../../common/swagger/api-nested-ok-response.helper';

@ApiTags('Control de Entrega')
@Controller('control-entrega/ordenes-pendientes')
export class OrdenesPendientesController {
  constructor(private readonly ordenesService: OrdenesPendientesService) {}

  @Get(':idUsuario')
  @ApiOperation({
    summary: 'Obtener órdenes pendientes de un usuario',
    description:
      'Obtiene todas las órdenes de entrega pendientes para un usuario específico',
  })
  @ApiParam({
    name: 'idUsuario',
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, OrdenesPendientesResponseDto],
    'Órdenes pendientes obtenidas exitosamente',
  )
  @ApiResponse({
    status: 400,
    description: 'ID de usuario inválido o formato incorrecto',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async obtenerOrdenesPendientes(
    @Param('idUsuario', ParseUUIDPipe) idUsuario: string,
  ): Promise<BaseResponseDto<OrdenesPendientesResponseDto>> {
    return await this.ordenesService.getOrdenesPendientes(idUsuario);
  }
}
