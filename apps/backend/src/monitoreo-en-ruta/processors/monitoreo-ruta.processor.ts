import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { MonitoreoEnRutaService } from '../monitoreo-en-ruta.service';
import {
  EstadoCompartimento,
  MonitoreoRuta,
} from '../interfaces/monitoreo-ruta.interface';
import { Severidad, TipoIncidencia } from '../interfaces/incidencia.interface';
import { UUID } from 'crypto';

@Processor('monitoreo')
export class MonitoreoRutaProcessor {
  private readonly logger = new Logger(MonitoreoRutaProcessor.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly monitoreoEnRutaService: MonitoreoEnRutaService,
  ) {}

  /**
   * Procesa la validación de incidencias para un monitoreo de ruta
   * @param job - El trabajo que contiene el monitoreo de ruta
   */
  @Process('validarIncidencia')
  async handleValidacionIncidencia(job: Job<MonitoreoRuta>) {
    const monitoreo = job.data;
    this.logger.debug(
      `[PROCESADOR] Iniciando validación de incidencias para monitoreo ${monitoreo.id_monitoreo_ruta}`,
    );

    try {
      // Validar condiciones
      await this.validarCondiciones(monitoreo);
    } catch (error: unknown) {
      this.logger.error(
        `[PROCESADOR] Error validando incidencias para monitoreo ${monitoreo.id_monitoreo_ruta}:`,
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw error;
    }
  }

  /**
   * Valida las condiciones de un monitoreo de ruta y crea incidencias si es necesario
   * @param monitoreo - El monitoreo de ruta a validar
   */
  private async validarCondiciones(monitoreo: MonitoreoRuta): Promise<void> {
    const LIMITE_VELOCIDAD = 120.0;
    const LIMITE_COMBUSTIBLE = 10.0;
    const TIEMPO_QUIETO = 30; // minutos
    const RADIO_DESTINO = 0.001; // ~100m
    const ID_USUARIO = 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d' as UUID; // Usuario del sistema

    // 1. Validar velocidad
    if (monitoreo.velocidad > LIMITE_VELOCIDAD) {
      await this.monitoreoEnRutaService.createIncidencia(ID_USUARIO, {
        id_monitoreo_ruta: monitoreo.id_monitoreo_ruta,
        tipo_incidencia: TipoIncidencia.OTRO,
        descripcion: `Velocidad registrada: ${monitoreo.velocidad} km/h`,
        severidad: Severidad.ALTA,
      });
    }

    // 2. Validar temperatura
    if (monitoreo.temperatura_carga) {
      const { tempMin, tempMax } = await this.obtenerRangosTemperatura(
        monitoreo.id_despacho,
      );
      if (
        monitoreo.temperatura_carga < tempMin ||
        monitoreo.temperatura_carga > tempMax
      ) {
        await this.monitoreoEnRutaService.createIncidencia(ID_USUARIO, {
          id_monitoreo_ruta: monitoreo.id_monitoreo_ruta,
          tipo_incidencia: TipoIncidencia.PROBLEMA_TEMPERATURA,
          descripcion: `Temperatura fuera de rango: ${monitoreo.temperatura_carga}°C (permitido: ${tempMin} - ${tempMax}°C)`,
          severidad: Severidad.ALTA,
        });
      }
    }

    // 3. Validar combustible
    if (monitoreo.combustible_restante < LIMITE_COMBUSTIBLE) {
      await this.monitoreoEnRutaService.createIncidencia(ID_USUARIO, {
        id_monitoreo_ruta: monitoreo.id_monitoreo_ruta,
        tipo_incidencia: TipoIncidencia.OTRO,
        descripcion: `Combustible restante bajo: ${monitoreo.combustible_restante} L`,
        severidad: Severidad.MEDIA,
      });
    }

    // 4. Validar compartimento
    if (monitoreo.estado_compartimento === EstadoCompartimento.ABIERTO) {
      const cercaDestino = await this.verificarCercaDestino(
        monitoreo.id_despacho,
        monitoreo.ubicacion_actual,
        RADIO_DESTINO,
      );

      if (!cercaDestino) {
        await this.monitoreoEnRutaService.createIncidencia(ID_USUARIO, {
          id_monitoreo_ruta: monitoreo.id_monitoreo_ruta,
          tipo_incidencia: TipoIncidencia.APERTURA_NO_AUTORIZADA,
          descripcion: 'Compartimento abierto fuera de punto de destino',
          severidad: Severidad.ALTA,
        });
      }
    }

    // 5. Validar detención prolongada
    const registrosQuietos = await this.contarRegistrosQuietos(
      monitoreo.id_despacho,
      monitoreo.ubicacion_actual,
      TIEMPO_QUIETO,
    );

    if (registrosQuietos > 5) {
      await this.monitoreoEnRutaService.createIncidencia(ID_USUARIO, {
        id_monitoreo_ruta: monitoreo.id_monitoreo_ruta,
        tipo_incidencia: TipoIncidencia.OTRO,
        descripcion:
          'El vehículo ha estado detenido en la misma ubicación por más de 30 minutos',
        severidad: Severidad.MEDIA,
      });
    }
  }

  private async verificarCercaDestino(
    idDespacho: UUID,
    ubicacionActual: { x: number; y: number },
    radio: number,
  ): Promise<boolean> {
    try {
      const result = await this.databaseService.query(
        `SELECT EXISTS (
          SELECT 1
          FROM Despacho d
          JOIN Asignacion_transporte at ON d.id_asignacion_transporte = at.id_asignacion_transporte
          JOIN Plan_entrega pe ON at.id_plan_entrega = pe.id_plan_entrega
          JOIN Detalle_plan_entrega dpe ON pe.id_plan_entrega = dpe.id_plan_entrega
          JOIN Tramo_ruta tr ON dpe.id_tramo_ruta = tr.id_tramo_ruta
          JOIN Punto_entrega pd ON tr.id_destino = pd.id_punto_entrega
          WHERE d.id_despacho = $1
          AND pd.coordenada_punto <@ circle(point($2, $3), $4)
        ) as exists`,
        [idDespacho, ubicacionActual.x, ubicacionActual.y, radio],
      );
      return (result.rows[0] as { exists: boolean }).exists;
    } catch (error) {
      this.logger.error('Error verificando cercanía a destino:', error);
      return false;
    }
  }

  private async contarRegistrosQuietos(
    idDespacho: UUID,
    ubicacionActual: { x: number; y: number },
    tiempoQuieto: number,
  ): Promise<number> {
    try {
      const result = await this.databaseService.query(
        `SELECT COUNT(*)
        FROM Monitoreo_ruta
        WHERE id_despacho = $1
          AND timestamp_registro >= (NOW() - interval '1 minute' * $2)
          AND ubicacion_actual <@ circle(point($3, $4), 0.0005)`,
        [idDespacho, tiempoQuieto, ubicacionActual.x, ubicacionActual.y],
      );
      return parseInt((result.rows[0] as { count: string }).count);
    } catch (error) {
      this.logger.error('Error contando registros quietos:', error);
      return 0;
    }
  }

  private async obtenerRangosTemperatura(
    idDespacho: UUID,
  ): Promise<{ tempMin: number; tempMax: number }> {
    try {
      const result = await this.databaseService.query(
        `SELECT ca.rango_inicial_temperatura_requerida as temp_min,
                ca.rango_final_temperatura_requerida as temp_max
         FROM Despacho d
         JOIN Asignacion_transporte at ON d.id_asignacion_transporte = at.id_asignacion_transporte
         JOIN Plan_entrega pe ON at.id_plan_entrega = pe.id_plan_entrega
         JOIN Detalle_plan_entrega dpe ON pe.id_plan_entrega = dpe.id_plan_entrega
         JOIN Detalle_carga dc ON dpe.id_detalle_carga = dc.id_detalle_carga
         JOIN Carga ca ON dc.id_carga = ca.id_carga
         WHERE d.id_despacho = $1
         LIMIT 1`,
        [idDespacho],
      );

      if (result.rows.length === 0) {
        return { tempMin: 0, tempMax: 30 }; // Valores por defecto
      }

      return {
        tempMin: (result.rows[0] as { temp_min: number }).temp_min,
        tempMax: (result.rows[0] as { temp_max: number }).temp_max,
      };
    } catch (error) {
      this.logger.error('Error obteniendo rangos de temperatura:', error);
      return { tempMin: 0, tempMax: 30 }; // Valores por defecto en caso de error
    }
  }
}
