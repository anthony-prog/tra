import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateVehiculoDto,
  UpdateVehiculoDto,
  VehiculoResponseDto,
  VehiculoListResponseDto,
  TipoVehiculo,
} from './dto/vehiculo.dto';
import {
  CreateConductorDto,
  UpdateConductorDto,
  ConductorResponseDto,
  ConductorListResponseDto,
  TipoLicencia,
  Genero,
} from './dto/conductor.dto';
import { Vehiculo } from './interfaces/vehiculo.interface';
import { Conductor } from './interfaces/conductor.interface';
import {
  BaseResponseDto,
  EmptyResponseDto,
} from '../common/dto/base-response.dto';

@Injectable()
export class AsignacionTransporteService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ==================== VEHÍCULOS ====================

  /**
   * Crea un nuevo vehículo
   */
  async createVehiculo(
    createVehiculoDto: CreateVehiculoDto,
  ): Promise<BaseResponseDto<VehiculoResponseDto>> {
    const query = `
        INSERT INTO Vehiculo (
          placa, marca, modelo, año, color, tipo_vehiculo, capacidad_carga, 
          capacidad_combustible, estado_vehiculo, numero_soat, fecha_vencimiento_soat, 
          gps_imei, gps_estado, foto_vehiculo, id_usuario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

    const values = [
      createVehiculoDto.placa,
      createVehiculoDto.marca,
      createVehiculoDto.modelo,
      createVehiculoDto.año,
      createVehiculoDto.color,
      createVehiculoDto.tipo_vehiculo,
      createVehiculoDto.capacidad_carga,
      createVehiculoDto.capacidad_combustible,
      createVehiculoDto.estado_vehiculo ?? true,
      createVehiculoDto.numero_soat,
      createVehiculoDto.fecha_vencimiento_soat,
      createVehiculoDto.gps_imei,
      createVehiculoDto.gps_estado ?? true,
      createVehiculoDto.foto_vehiculo || null,
      createVehiculoDto.id_usuario,
    ];

    const result = await this.databaseService.query(query, values);

    if (result.rows.length === 0) {
      throw new BadRequestException('No se pudo crear el vehículo');
    }

    const vehiculo = result.rows[0] as Vehiculo;
    return BaseResponseDto.success(
      'Vehículo creado exitosamente',
      this.mapVehiculoToResponse(vehiculo),
    );
  }

  /**
   * Obtiene todos los vehículos con paginación
   */
  async findAllVehiculos(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseDto<VehiculoListResponseDto>> {
    const offset = (page - 1) * limit;

    // Consulta para obtener el total
    const countQuery = 'SELECT COUNT(*) FROM Vehiculo';
    const countResult = await this.databaseService.query(countQuery);
    const total = parseInt((countResult.rows[0] as { count: string }).count);

    // Consulta para obtener los vehículos
    const query = `
      SELECT * FROM Vehiculo 
      ORDER BY fecha_registro DESC 
      LIMIT $1 OFFSET $2
    `;

    const result = await this.databaseService.query(query, [limit, offset]);
    const vehiculos = result.rows.map((vehiculo) =>
      this.mapVehiculoToResponse(vehiculo as Vehiculo),
    );

    const response: VehiculoListResponseDto = {
      vehiculos,
      total,
      pagina: page,
      por_pagina: limit,
    };

    return BaseResponseDto.success(
      'Vehículos obtenidos exitosamente',
      response,
    );
  }

  /**
   * Obtiene un vehículo por ID
   */
  async findVehiculoById(
    id: string,
  ): Promise<BaseResponseDto<VehiculoResponseDto>> {
    const query = 'SELECT * FROM Vehiculo WHERE id_vehiculo = $1';
    const result = await this.databaseService.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const vehiculo = this.mapVehiculoToResponse(result.rows[0] as Vehiculo);
    return BaseResponseDto.success(
      'Vehículo encontrado exitosamente',
      vehiculo,
    );
  }

  /**
   * Actualiza un vehículo
   */
  async updateVehiculo(
    id: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<BaseResponseDto<VehiculoResponseDto>> {
    // Verificar que el vehículo existe
    await this.findVehiculoById(id);

    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    // Construir dinámicamente la consulta
    Object.entries(updateVehiculoDto).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron campos para actualizar',
      );
    }

    values.push(id);
    const query = `
      UPDATE Vehiculo 
      SET ${fields.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_vehiculo = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await this.databaseService.query(query, values);
      const vehiculo = this.mapVehiculoToResponse(result.rows[0] as Vehiculo);
      return BaseResponseDto.success(
        'Vehículo actualizado exitosamente',
        vehiculo,
      );
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        // Unique violation
        throw new BadRequestException(
          'Ya existe un vehículo con esa placa o número de SOAT',
        );
      }
      throw error;
    }
  }

  /**
   * Elimina un vehículo (soft delete cambiando estado)
   */
  async removeVehiculo(id: string): Promise<EmptyResponseDto> {
    // Verificar que el vehículo existe
    await this.findVehiculoById(id);

    const query = `
      UPDATE Vehiculo 
      SET estado_vehiculo = false, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_vehiculo = $1
    `;

    await this.databaseService.query(query, [id]);
    return EmptyResponseDto.success('Vehículo eliminado exitosamente');
  }

  // ==================== CONDUCTORES ====================

  /**
   * Crea un nuevo conductor
   */
  async createConductor(
    createConductorDto: CreateConductorDto,
  ): Promise<BaseResponseDto<ConductorResponseDto>> {
    const query = `
        INSERT INTO Conductor (
          DNI, nombre_conductor, telefono_conductor, email_conductor, direccion_conductor,
          estado_conductor, tipo_licencia, fecha_emision_licencia, fecha_vencimiento_licencia,
          fecha_nacimiento, genero, foto_conductor, id_usuario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

    const values = [
      createConductorDto.DNI,
      createConductorDto.nombre_conductor,
      createConductorDto.telefono_conductor,
      createConductorDto.email_conductor,
      createConductorDto.direccion_conductor || null,
      createConductorDto.estado_conductor ?? true,
      createConductorDto.tipo_licencia,
      createConductorDto.fecha_emision_licencia,
      createConductorDto.fecha_vencimiento_licencia,
      createConductorDto.fecha_nacimiento,
      createConductorDto.genero,
      createConductorDto.foto_conductor || null,
      createConductorDto.id_usuario,
    ];

    const result = await this.databaseService.query(query, values);

    if (result.rows.length === 0) {
      throw new BadRequestException('No se pudo crear el conductor');
    }

    const conductor = result.rows[0] as Conductor;
    return BaseResponseDto.success(
      'Conductor creado exitosamente',
      this.mapConductorToResponse(conductor),
    );
  }

  /**
   * Obtiene todos los conductores con paginación
   */
  async findAllConductores(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseDto<ConductorListResponseDto>> {
    const offset = (page - 1) * limit;

    // Consulta para obtener el total
    const countQuery = 'SELECT COUNT(*) FROM Conductor';
    const countResult = await this.databaseService.query(countQuery);
    const total = parseInt((countResult.rows[0] as { count: string }).count);

    // Consulta para obtener los conductores
    const query = `
      SELECT * FROM Conductor 
      ORDER BY fecha_registro DESC 
      LIMIT $1 OFFSET $2
    `;

    const result = await this.databaseService.query(query, [limit, offset]);
    const conductores = result.rows.map((conductor) =>
      this.mapConductorToResponse(conductor as Conductor),
    );

    const response: ConductorListResponseDto = {
      conductores,
      total,
      pagina: page,
      por_pagina: limit,
    };

    return BaseResponseDto.success(
      'Conductores obtenidos exitosamente',
      response,
    );
  }

  /**
   * Obtiene un conductor por ID
   */
  async findConductorById(
    id: string,
  ): Promise<BaseResponseDto<ConductorResponseDto>> {
    const query = 'SELECT * FROM Conductor WHERE id_conductor = $1';
    const result = await this.databaseService.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Conductor no encontrado');
    }

    const conductor = this.mapConductorToResponse(result.rows[0] as Conductor);
    return BaseResponseDto.success(
      'Conductor encontrado exitosamente',
      conductor,
    );
  }

  /**
   * Actualiza un conductor
   */
  async updateConductor(
    id: string,
    updateConductorDto: UpdateConductorDto,
  ): Promise<BaseResponseDto<ConductorResponseDto>> {
    // Verificar que el conductor existe
    await this.findConductorById(id);

    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    // Construir dinámicamente la consulta
    Object.entries(updateConductorDto).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new BadRequestException(
        'No se proporcionaron campos para actualizar',
      );
    }

    values.push(id);
    const query = `
      UPDATE Conductor 
      SET ${fields.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_conductor = $${paramCount}
      RETURNING *
    `;

    const result = await this.databaseService.query(query, values);
    const conductor = this.mapConductorToResponse(result.rows[0] as Conductor);
    return BaseResponseDto.success(
      'Conductor actualizado exitosamente',
      conductor,
    );
  }

  /**
   * Elimina un conductor (soft delete cambiando estado)
   */
  async removeConductor(id: string): Promise<EmptyResponseDto> {
    // Verificar que el conductor existe
    await this.findConductorById(id);

    const query = `
      UPDATE Conductor 
      SET estado_conductor = false, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_conductor = $1
    `;

    await this.databaseService.query(query, [id]);
    return EmptyResponseDto.success('Conductor eliminado exitosamente');
  }

  // ==================== MÉTODOS AUXILIARES ====================

  private mapVehiculoToResponse(vehiculo: Vehiculo): VehiculoResponseDto {
    return {
      id_vehiculo: vehiculo.id_vehiculo,
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      año: vehiculo.año,
      color: vehiculo.color,
      tipo_vehiculo: vehiculo.tipo_vehiculo as TipoVehiculo,
      capacidad_carga: vehiculo.capacidad_carga,
      capacidad_combustible: vehiculo.capacidad_combustible,
      estado_vehiculo: vehiculo.estado_vehiculo,
      numero_soat: vehiculo.numero_soat,
      fecha_vencimiento_soat: vehiculo.fecha_vencimiento_soat,
      fecha_registro: vehiculo.fecha_registro,
      gps_imei: vehiculo.gps_imei,
      gps_estado: vehiculo.gps_estado,
      foto_vehiculo: vehiculo.foto_vehiculo,
      id_usuario: vehiculo.id_usuario,
    };
  }

  private mapConductorToResponse(conductor: Conductor): ConductorResponseDto {
    return {
      id_conductor: conductor.id_conductor,
      DNI: conductor.DNI,
      nombre_conductor: conductor.nombre_conductor,
      telefono_conductor: conductor.telefono_conductor,
      email_conductor: conductor.email_conductor,
      direccion_conductor: conductor.direccion_conductor,
      estado_conductor: conductor.estado_conductor,
      tipo_licencia: conductor.tipo_licencia as TipoLicencia,
      fecha_emision_licencia: conductor.fecha_emision_licencia,
      fecha_vencimiento_licencia: conductor.fecha_vencimiento_licencia,
      fecha_nacimiento: conductor.fecha_nacimiento,
      fecha_registro: conductor.fecha_registro,
      genero: conductor.genero as Genero,
      foto_conductor: conductor.foto_conductor,
      id_usuario: conductor.id_usuario,
    };
  }
}
