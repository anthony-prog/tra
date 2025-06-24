import {
  Controller,
  Param,
  Sse,
  MessageEvent,
  Get,
  Query,
  Post,
  Body,
  Patch,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';
import { MonitoreoEnRutaService } from './monitoreo-en-ruta.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UUID } from 'node:crypto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { DespachoDto } from './dto/despacho.dto';
import {
  BaseResponseDto,
  EmptyResponseDto,
} from 'src/common/dto/base-response.dto';
import { ApiDeepNestedOkResponse } from 'src/common/swagger/api-nested-ok-response.helper';
import { MonitoreoDto } from './dto/monitoreo.dto';
import { UltimoMonitoreoDto } from './dto/ultimo-monitoreo.dto';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { SolucionIncidenciaDto } from './dto/solucion-incidencia.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { IncidenciaDto } from './dto/incidencia.dto';
import { DespachoDatosDto } from './dto/despacho-datos.dto';
import { PuntoRutaDto } from './dto/punto-ruta.dto';
import { PuntoVisitadoDto } from './dto/punto-visitado.dto';
import { IncidenciaDatosDto } from './dto/incidencia-datos.dto';
import { IncidenciaRelacionadaDto } from './dto/incidencia-relacionada.dto';
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response.helper';
import {
  AuthenticatedUser,
  UserRole,
} from 'src/auth/interfaces/roles.interface';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Monitoreo en Ruta')
@Controller('monitoreo-ruta')
@ApiExtraModels(
  BaseResponseDto,
  PaginatedResponseDto,
  DespachoDto,
  MonitoreoDto,
  CreateIncidenciaDto,
  SolucionIncidenciaDto,
  IncidenciaDto,
  DespachoDatosDto,
  PuntoRutaDto,
  PuntoVisitadoDto,
)
export class MonitoreoEnRutaController {
  constructor(private readonly monitoreoService: MonitoreoEnRutaService) {}

  @Sse('monitoreo/:despachoId')
  @ApiOperation({
    summary: 'Suscripción a datos de monitoreo',
    description:
      'Endpoint SSE (Server-Sent Events) para recibir actualizaciones en tiempo real de un despacho específico.',
  })
  @ApiResponse({
    status: 200,
    description: 'Conexión SSE establecida correctamente',
    content: {
      'text/event-stream': {
        schema: {
          type: 'object',
          required: ['data', 'type', 'id', 'retry'],
          properties: {
            data: { $ref: '#/components/schemas/MonitoreoDto' },
            type: { type: 'string', example: 'monitoreo' },
            id: { type: 'string' },
            retry: { type: 'number', example: 5000 },
          },
        },
      },
    },
  })
  monitoreoEnTiempoReal(
    @Param('despachoId') despachoId: UUID,
  ): Observable<MessageEvent> {
    return this.monitoreoService
      .getMonitoreoObservableByDespacho(despachoId)
      .pipe(
        map((data) => ({
          data,
          type: 'monitoreo',
          id: String(Date.now()),
          retry: 5000,
        })),
      );
  }

  @Get('despachos')
  @ApiOperation({
    summary: 'Obtener despachos con paginación',
    description:
      'Obtiene los despachos paginados con ordenamiento por fecha de creación',
  })
  @ApiPaginatedResponse(DespachoDto, 'Despachos obtenidos correctamente')
  async getDespachosPaginados(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponseDto<DespachoDto>> {
    const result = await this.monitoreoService.getDespachosPaginados(
      page,
      limit,
    );
    return PaginatedResponseDto.success(
      'Despachos obtenidos correctamente',
      result.items,
      result.meta,
    );
  }

  @Get('ultimo-monitoreo/:despachoId')
  @ApiOperation({
    summary: 'Obtener el último monitoreo de un despacho',
    description: 'Obtiene el último monitoreo de un despacho',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, UltimoMonitoreoDto],
    'Último monitoreo obtenido correctamente',
  )
  @ApiResponse({
    status: 404,
    description: 'No se encontró el despacho o no tiene monitoreos registrados',
    type: ErrorResponseDto,
  })
  async getUltimoMonitoreo(
    @Param('despachoId') despachoId: UUID,
  ): Promise<BaseResponseDto<UltimoMonitoreoDto>> {
    return BaseResponseDto.success(
      'Último monitoreo obtenido correctamente',
      await this.monitoreoService.getUltimoMonitoreo(despachoId),
    );
  }

  @Post('incidencia')
  @Auth(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.OPERADOR,
    UserRole.MONITOR,
  )
  @ApiOperation({
    summary: 'Crear una incidencia',
    description: 'Crea una incidencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencia creada correctamente',
    type: EmptyResponseDto,
  })
  async createIncidencia(
    @CurrentUser() user: AuthenticatedUser,
    @Body() incidenciaDto: CreateIncidenciaDto,
  ): Promise<EmptyResponseDto> {
    await this.monitoreoService.createIncidencia(
      user.id_usuario as UUID,
      incidenciaDto,
    );
    return EmptyResponseDto.success('Incidencia creada correctamente');
  }

  @Patch('incidencia/:incidenciaId')
  @ApiOperation({
    summary: 'Actualizar el estado de una incidencia',
    description: 'Actualiza el estado de una incidencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencia actualizada correctamente',
    type: EmptyResponseDto,
  })
  async updateIncidenciaState(
    @Param('incidenciaId') incidenciaId: UUID,
    @Body() estado_incidencia: UpdateIncidenciaDto,
  ): Promise<EmptyResponseDto> {
    await this.monitoreoService.updateIncidenciaState(
      incidenciaId,
      estado_incidencia.estado_incidencia,
    );
    return EmptyResponseDto.success('Incidencia actualizada correctamente');
  }

  @Post('solucionar-incidencia/:incidenciaId')
  @Auth(
    UserRole.ADMIN,
    UserRole.SUPERVISOR,
    UserRole.OPERADOR,
    UserRole.MONITOR,
  )
  @ApiOperation({
    summary: 'Solucionar una incidencia',
    description: 'Soluciona una incidencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencia solucionada correctamente',
    type: EmptyResponseDto,
  })
  async solucionarIncidencia(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidenciaId') incidenciaId: UUID,
    @Body() solucion_incidencia: SolucionIncidenciaDto,
  ): Promise<EmptyResponseDto> {
    await this.monitoreoService.solucionarIncidencia(
      incidenciaId,
      solucion_incidencia,
      user.id_usuario as UUID,
    );
    return EmptyResponseDto.success('Incidencia solucionada correctamente');
  }

  @Get('incidencias')
  @ApiOperation({
    summary: 'Obtener incidencias con paginación',
    description:
      'Obtiene las incidencias paginadas con ordenamiento por fecha de registro',
  })
  @ApiPaginatedResponse(IncidenciaDto, 'Incidencias obtenidas correctamente')
  async getIncidenciasPaginadas(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponseDto<IncidenciaDto>> {
    const result = await this.monitoreoService.getIncidenciasPaginadas(
      page,
      limit,
    );
    return PaginatedResponseDto.success(
      'Incidencias obtenidas correctamente',
      result.items,
      result.meta,
    );
  }

  @Get('despachos/:despachoId')
  @ApiOperation({
    summary: 'Obtener datos básicos de un despacho',
    description: 'Obtiene los datos básicos de un despacho específico',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, DespachoDatosDto],
    'Datos básicos del despacho obtenidos correctamente',
  )
  async getDespachoDatos(
    @Param('despachoId') despachoId: UUID,
  ): Promise<BaseResponseDto<DespachoDatosDto>> {
    return BaseResponseDto.success(
      'Datos básicos del despacho obtenidos correctamente',
      await this.monitoreoService.getDespachoDatos(despachoId),
    );
  }

  @Get('despachos/:despachoId/puntos-ruta')
  @ApiOperation({
    summary: 'Obtener puntos de la ruta de un despacho',
    description: 'Obtiene los puntos de la ruta de un despacho específico',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, [PuntoRutaDto]],
    'Puntos de la ruta obtenidos correctamente',
  )
  async getPuntosRuta(
    @Param('despachoId') despachoId: UUID,
  ): Promise<BaseResponseDto<PuntoRutaDto[]>> {
    return BaseResponseDto.success(
      'Puntos de la ruta obtenidos correctamente',
      await this.monitoreoService.getPuntosRuta(despachoId),
    );
  }

  @Get('despachos/:despachoId/puntos-visitados')
  @ApiOperation({
    summary: 'Obtener puntos visitados de un despacho',
    description: 'Obtiene los puntos visitados de un despacho específico',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, [PuntoVisitadoDto]],
    'Puntos visitados obtenidos correctamente',
  )
  async getPuntosVisitados(
    @Param('despachoId') despachoId: UUID,
  ): Promise<BaseResponseDto<PuntoVisitadoDto[]>> {
    return BaseResponseDto.success(
      'Puntos visitados obtenidos correctamente',
      await this.monitoreoService.getPuntosVisitados(despachoId),
    );
  }

  @Get('incidencias/:incidenciaId')
  @ApiOperation({
    summary: 'Obtener una incidencia',
    description: 'Obtiene una incidencia específica',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, IncidenciaDatosDto],
    'Incidencia obtenida correctamente',
  )
  async getIncidenciaDatos(
    @Param('incidenciaId') incidenciaId: UUID,
  ): Promise<BaseResponseDto<IncidenciaDatosDto>> {
    return BaseResponseDto.success(
      'Incidencia obtenida correctamente',
      await this.monitoreoService.getIncidenciaDatos(incidenciaId),
    );
  }

  @Get('incidencias/:incidenciaId/relacionada')
  @ApiOperation({
    summary: 'Obtener el historial de una incidencia',
    description: 'Obtiene el historial de una incidencia específica',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, [IncidenciaRelacionadaDto]],
    'Historial de la incidencia obtenido correctamente',
  )
  async getHistorialIncidencia(
    @Param('incidenciaId') incidenciaId: UUID,
  ): Promise<BaseResponseDto<IncidenciaRelacionadaDto[]>> {
    return BaseResponseDto.success(
      'Historial de la incidencia obtenido correctamente',
      await this.monitoreoService.getIncidenciasRelacionadas(incidenciaId),
    );
  }
}
