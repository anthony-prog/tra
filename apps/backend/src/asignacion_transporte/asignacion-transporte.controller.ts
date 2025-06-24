import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AsignacionTransporteService } from './asignacion-transporte.service';
import {
  CreateVehiculoDto,
  UpdateVehiculoDto,
  VehiculoResponseDto,
  VehiculoListResponseDto,
} from './dto/vehiculo.dto';
import {
  CreateConductorDto,
  UpdateConductorDto,
  ConductorResponseDto,
  ConductorListResponseDto,
} from './dto/conductor.dto';
import {
  BaseResponseDto,
  EmptyResponseDto,
} from '../common/dto/base-response.dto';
import { ApiDeepNestedOkResponse } from '../common/swagger/api-nested-ok-response.helper';

@ApiTags('Asignación de Transporte')
@Controller('asignacion-transporte')
export class AsignacionTransporteController {
  constructor(
    private readonly asignacionTransporteService: AsignacionTransporteService,
  ) {}

  // ==================== VEHÍCULOS ====================

  @Post('vehiculos')
  @ApiOperation({
    summary: 'Crear un nuevo vehículo',
    description:
      'Crea un nuevo vehículo en el sistema con toda la información requerida',
  })
  @ApiBody({
    type: CreateVehiculoDto,
    description: 'Datos del vehículo a crear',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, VehiculoResponseDto],
    'Vehículo creado exitosamente',
  )
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o vehículo ya existe',
  })
  async createVehiculo(
    @Body(ValidationPipe) createVehiculoDto: CreateVehiculoDto,
  ): Promise<BaseResponseDto<VehiculoResponseDto>> {
    return this.asignacionTransporteService.createVehiculo(createVehiculoDto);
  }

  @Get('vehiculos')
  @ApiOperation({
    summary: 'Obtener todos los vehículos',
    description:
      'Obtiene una lista paginada de todos los vehículos registrados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, VehiculoListResponseDto],
    'Vehículos obtenidos exitosamente',
  )
  async findAllVehiculos(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<BaseResponseDto<VehiculoListResponseDto>> {
    return this.asignacionTransporteService.findAllVehiculos(page, limit);
  }

  @Get('vehiculos/:id')
  @ApiOperation({
    summary: 'Obtener un vehículo por ID',
    description: 'Obtiene la información detallada de un vehículo específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del vehículo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, VehiculoResponseDto],
    'Vehículo encontrado exitosamente',
  )
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado',
  })
  async findVehiculoById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<VehiculoResponseDto>> {
    return this.asignacionTransporteService.findVehiculoById(id);
  }

  @Patch('vehiculos/:id')
  @ApiOperation({
    summary: 'Actualizar un vehículo',
    description: 'Actualiza la información de un vehículo existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del vehículo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateVehiculoDto,
    description: 'Datos del vehículo a actualizar',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, VehiculoResponseDto],
    'Vehículo actualizado exitosamente',
  )
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o vehículo ya existe',
  })
  async updateVehiculo(
    @Param('id') id: string,
    @Body(ValidationPipe) updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<BaseResponseDto<VehiculoResponseDto>> {
    return this.asignacionTransporteService.updateVehiculo(
      id,
      updateVehiculoDto,
    );
  }

  @Delete('vehiculos/:id')
  @ApiOperation({
    summary: 'Eliminar un vehículo',
    description:
      'Elimina un vehículo del sistema (cambia su estado a inactivo)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del vehículo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, EmptyResponseDto],
    'Vehículo eliminado exitosamente',
  )
  @ApiResponse({
    status: 404,
    description: 'Vehículo no encontrado',
  })
  async removeVehiculo(@Param('id') id: string): Promise<EmptyResponseDto> {
    return this.asignacionTransporteService.removeVehiculo(id);
  }

  // ==================== CONDUCTORES ====================

  @Post('conductores')
  @ApiOperation({
    summary: 'Crear un nuevo conductor',
    description:
      'Crea un nuevo conductor en el sistema con toda la información requerida',
  })
  @ApiBody({
    type: CreateConductorDto,
    description: 'Datos del conductor a crear',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, ConductorResponseDto],
    'Conductor creado exitosamente',
  )
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o conductor ya existe',
  })
  async createConductor(
    @Body(ValidationPipe) createConductorDto: CreateConductorDto,
  ): Promise<BaseResponseDto<ConductorResponseDto>> {
    return this.asignacionTransporteService.createConductor(createConductorDto);
  }

  @Get('conductores')
  @ApiOperation({
    summary: 'Obtener todos los conductores',
    description:
      'Obtiene una lista paginada de todos los conductores registrados',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto: 10)',
    example: 10,
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, ConductorListResponseDto],
    'Conductores obtenidos exitosamente',
  )
  async findAllConductores(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<BaseResponseDto<ConductorListResponseDto>> {
    return this.asignacionTransporteService.findAllConductores(page, limit);
  }

  @Get('conductores/:id')
  @ApiOperation({
    summary: 'Obtener un conductor por ID',
    description: 'Obtiene la información detallada de un conductor específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del conductor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, ConductorResponseDto],
    'Conductor encontrado exitosamente',
  )
  @ApiResponse({
    status: 404,
    description: 'Conductor no encontrado',
  })
  async findConductorById(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<ConductorResponseDto>> {
    return this.asignacionTransporteService.findConductorById(id);
  }

  @Patch('conductores/:id')
  @ApiOperation({
    summary: 'Actualizar un conductor',
    description: 'Actualiza la información de un conductor existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del conductor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateConductorDto,
    description: 'Datos del conductor a actualizar',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, ConductorResponseDto],
    'Conductor actualizado exitosamente',
  )
  @ApiResponse({
    status: 404,
    description: 'Conductor no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o conductor ya existe',
  })
  async updateConductor(
    @Param('id') id: string,
    @Body(ValidationPipe) updateConductorDto: UpdateConductorDto,
  ): Promise<BaseResponseDto<ConductorResponseDto>> {
    return this.asignacionTransporteService.updateConductor(
      id,
      updateConductorDto,
    );
  }

  @Delete('conductores/:id')
  @ApiOperation({
    summary: 'Eliminar un conductor',
    description:
      'Elimina un conductor del sistema (cambia su estado a inactivo)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del conductor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiDeepNestedOkResponse(
    [BaseResponseDto, EmptyResponseDto],
    'Conductor eliminado exitosamente',
  )
  @ApiResponse({
    status: 404,
    description: 'Conductor no encontrado',
  })
  async removeConductor(@Param('id') id: string): Promise<EmptyResponseDto> {
    return this.asignacionTransporteService.removeConductor(id);
  }
}
