import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  OrdenPendiente,
  OrdenPendienteRow,
} from './interfaces/orden-pendiente.interface';
import { OrdenesPendientesResponseDto } from './dto/orden-pendiente.dto';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

@Injectable()
export class OrdenesPendientesService {
  constructor(private readonly db: DatabaseService) {}

  async getOrdenesPendientes(
    idUsuario: string,
  ): Promise<BaseResponseDto<OrdenesPendientesResponseDto>> {
    // Validar que el ID de usuario no esté vacío
    if (!idUsuario || idUsuario.trim() === '') {
      throw new BadRequestException('El ID de usuario es requerido');
    }

    const query = `
      SELECT 
          e.id_entrega,
          pe.nombre_punto,
          pe.coordenada_punto::text AS coordenada_punto,
          e.fecha_entrega,
          COUNT(de.id_detalle_entrega) AS total_subentregas
      FROM 
          Entrega e
      LEFT JOIN 
          Detalle_entrega de ON e.id_entrega = de.id_entrega
      JOIN 
          Punto_entrega pe ON e.punto_entrega = pe.id_punto_entrega
      WHERE 
          e.id_usuario = $1
          AND e.estado_entrega = 'pendiente'
      GROUP BY 
          e.id_entrega, e.fecha_entrega, pe.nombre_punto, 
          pe.coordenada_punto::text
      ORDER BY 
          e.fecha_entrega ASC;
    `;

    try {
      const result = await this.db.query(query, [idUsuario]);
      const ordenes = result.rows.map((row: OrdenPendienteRow) => ({
        id_entrega: row.id_entrega,
        nombre_punto: row.nombre_punto,
        coordenada_punto: row.coordenada_punto,
        fecha_entrega: row.fecha_entrega,
        total_subentregas: parseInt(row.total_subentregas),
      })) as OrdenPendiente[];

      const response: OrdenesPendientesResponseDto = {
        ordenes,
        total: ordenes.length,
      };

      return BaseResponseDto.success(
        `Se encontraron ${ordenes.length} órdenes pendientes`,
        response,
      );
    } catch (error: unknown) {
      // Si no se encuentra el usuario, devolver lista vacía en lugar de error
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23503'
      ) {
        // Foreign key violation
        const response: OrdenesPendientesResponseDto = {
          ordenes: [],
          total: 0,
        };
        return BaseResponseDto.success(
          'No se encontraron órdenes pendientes para este usuario',
          response,
        );
      }
      throw error;
    }
  }
}
