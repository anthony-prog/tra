import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { MonitoreoDto } from './dto/monitoreo.dto';
import { Subject, Observable } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';
import { MqttService } from './mqtt/mqtt.service';
import { MonitoreoRuta } from './interfaces/monitoreo-ruta.interface';
import { EstadoIncidencia } from './interfaces/incidencia.interface';
import { DespachoDto } from './dto/despacho.dto';
import { UUID } from 'node:crypto';
import { UltimoMonitoreoDto } from './dto/ultimo-monitoreo.dto';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { SolucionIncidenciaDto } from './dto/solucion-incidencia.dto';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { IncidenciaDto } from './dto/incidencia.dto';
import { DespachoDatosDto } from './dto/despacho-datos.dto';
import { PuntoRutaDto } from './dto/punto-ruta.dto';
import { PuntoVisitadoDto } from './dto/punto-visitado.dto';
import { DespachoDatos } from './interfaces/despacho-datos.interface';
import { PuntoRutaDatos } from './interfaces/punto-ruta.interface';
import { PuntoVisitadoDatos } from './interfaces/punto-visitado.interface';
import { IncidenciaDatos } from './interfaces/incidencia-datos.interface';
import { IncidenciaDatosDto } from './dto/incidencia-datos.dto';
import { IncidenciaRelacionadaDto } from './dto/incidencia-relacionada.dto';
import { VistaDespachosRow } from './interfaces/vista-despachos.interface';

@Injectable()
export class MonitoreoEnRutaService implements OnModuleInit {
  private readonly logger = new Logger(MonitoreoEnRutaService.name);
  private readonly monitoreoSubject = new Subject<MonitoreoDto>();
  private monitoreoSubscriberCount = 0;
  private readonly GPS_TOPIC = 'gps/+/data'; // El + es un wildcard que acepta cualquier ID

  constructor(
    private readonly databaseService: DatabaseService,
    @InjectQueue('monitoreo') private readonly monitoreoQueue: Queue,
    private readonly mqttService: MqttService,
  ) {}

  /**
   * Inicializa el servicio de monitoreo
   */
  onModuleInit() {
    this.logger.log('[MONITOREO] Iniciando servicio de monitoreo');

    // Esperar 2 segundos para dar tiempo a que MQTT se conecte
    setTimeout(() => {
      if (this.mqttService.isMqttAvailable()) {
        this.logger.log(
          '[MONITOREO] MQTT disponible, configurando suscripción',
        );
        this.setupMqttSubscription();
      } else {
        this.logger.log(
          '[MONITOREO] MQTT no disponible, usando HTTP como fallback',
        );
      }
    }, 2000);

    this.setupQueueEvents();
  }

  /**
   * Configura la suscripción a los datos GPS del módulo MQTT
   */
  private setupMqttSubscription() {
    this.mqttService.subscribe<MonitoreoDto>(
      this.GPS_TOPIC,
      (data: MonitoreoDto) => {
        this.handleGpsData(data);
      },
    );
  }

  /**
   * Maneja los datos GPS recibidos del módulo MQTT
   * @param data - Los datos GPS recibidos
   */
  private handleGpsData(data: MonitoreoDto) {
    // 1. Notificar a los suscriptores
    if (this.hasMonitoreoSubscribers()) {
      this.monitoreoSubject.next(data);
    }

    // 2. Procesar los datos en segundo plano
    this.procesarDatosGPS(data).catch((error) => {
      this.logger.error('Error procesando datos GPS:', error);
    });
  }

  /**
   * Configura los eventos de la cola de monitoreo
   */
  private setupQueueEvents() {
    this.monitoreoQueue.on('completed', (job) => {
      switch (job.name) {
        // se puede agregar mas casos para otras colas
        case 'monitoreo':
          this.monitoreoSubject.next(job.data as MonitoreoDto);
          break;
      }
    });
  }

  /**
   * Obtiene un observable para los monitoreos
   * @returns Un observable para los monitoreos
   */
  getMonitoreoObservable(): Observable<MonitoreoDto> {
    this.monitoreoSubscriberCount++;
    return this.monitoreoSubject.asObservable().pipe(
      finalize(() => {
        this.monitoreoSubscriberCount--;
      }),
    );
  }

  /**
   * Obtiene un observable para los monitoreos de un despacho específico
   * @param despachoId - El ID del despacho
   * @returns Un observable para los monitoreos de un despacho específico
   */
  getMonitoreoObservableByDespacho(despachoId: UUID): Observable<MonitoreoDto> {
    return this.getMonitoreoObservable().pipe(
      filter((monitoreo) => monitoreo.id_despacho === despachoId),
    );
  }

  /**
   * Verifica si hay suscriptores para los monitoreos
   * @returns true si hay suscriptores para los monitoreos, false en caso contrario
   */
  private hasMonitoreoSubscribers(): boolean {
    return this.monitoreoSubscriberCount > 0;
  }

  /**
   * Procesa los datos GPS recibidos del módulo MQTT
   * @param dto - Los datos GPS recibidos
   */
  async procesarDatosGPS(dto: MonitoreoDto): Promise<void> {
    try {
      this.logger.debug(
        `Procesando datos GPS para despacho ${dto.id_despacho}`,
      );

      // 1. Insertar datos en la base de datos (operación crítica)
      const result = await this.databaseService.query(
        `INSERT INTO Monitoreo_ruta (
          id_despacho, ubicacion_actual, velocidad, temperatura_carga, 
          combustible_restante, estado_compartimento, distancia_recorrida, tiempo_transcurrido
        ) VALUES ($1, point($2, $3), $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          dto.id_despacho,
          dto.ubicacion_actual.lat,
          dto.ubicacion_actual.lng,
          dto.velocidad,
          dto.temperatura_carga,
          dto.combustible_restante,
          dto.estado_compartimento,
          dto.distancia_recorrida,
          dto.tiempo_transcurrido,
        ],
      );

      const monitoreo = result.rows[0] as MonitoreoRuta;

      // 2. Encolar validaciones en segundo plano
      this.enqueueValidations(monitoreo);

      this.logger.debug(
        `Datos GPS procesados exitosamente para despacho ${dto.id_despacho}`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error procesando datos GPS para despacho ${dto.id_despacho}:`,
        error instanceof Error ? error.stack : 'Unknown error',
      );
      throw error;
    }
  }

  /**
   * Encola las validaciones para un monitoreo de ruta
   * @param monitoreo - El monitoreo de ruta a validar
   */
  private enqueueValidations(monitoreo: MonitoreoRuta): void {
    try {
      // Encolar de forma asíncrona sin esperar
      this.monitoreoQueue
        .add('validarIncidencia', monitoreo, {
          priority: 1,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        })
        .catch((error) => {
          this.logger.error(
            `[MONITOREO] Error encolando validaciones para monitoreo ${monitoreo.id_monitoreo_ruta}:`,
            error instanceof Error ? error.stack : 'Unknown error',
          );
        });
    } catch (error) {
      this.logger.error(
        `[MONITOREO] Error encolando validaciones para monitoreo ${monitoreo.id_monitoreo_ruta}:`,
        error instanceof Error ? error.stack : 'Unknown error',
      );
    }
  }

  /**
   * Obtiene el último monitoreo de un despacho
   * @param despachoId - El ID del despacho
   * @returns El último monitoreo de un despacho
   * @throws CustomException si el despacho no existe o no tiene monitoreos
   */
  async getUltimoMonitoreo(despachoId: UUID): Promise<UltimoMonitoreoDto> {
    interface QueryResult {
      id_monitoreo_ruta: UUID | null;
      ubicacion_actual: { x: number; y: number } | null;
      despacho_existe: boolean;
    }

    const query = ` 
      WITH despacho_existe AS (
        SELECT EXISTS (
          SELECT 1 FROM Despacho WHERE id_despacho = $1
        ) as existe
      )
      SELECT
          mr.id_monitoreo_ruta AS id_monitoreo_ruta,
          mr.ubicacion_actual AS ubicacion_actual,
          de.existe as despacho_existe
      FROM
          despacho_existe de
          LEFT JOIN Monitoreo_ruta mr ON mr.id_despacho = $1
      ORDER BY
          mr.timestamp_registro DESC
      LIMIT 1;
    `;
    const result = await this.databaseService.query(query, [despachoId]);
    const row = result.rows[0] as QueryResult;

    if (!row.despacho_existe) {
      throw new CustomException(
        `No se encontró el despacho con ID: ${despachoId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!row.id_monitoreo_ruta) {
      throw new CustomException(
        `El despacho con ID: ${despachoId} no tiene monitoreos registrados`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      id_monitoreo_ruta: row.id_monitoreo_ruta,
      ubicacion_actual: row.ubicacion_actual!,
    };
  }

  /**
   * Parsea una cadena de punto a un objeto { lat: number; lng: number }
   * @param pointStr - La cadena de punto
   * @returns El objeto { lat: number; lng: number }
   */
  private parsePoint(pointStr: string): { lat: number; lng: number } {
    // Eliminar paréntesis y dividir por coma
    const [lng, lat] = pointStr.replace(/[()]/g, '').split(',').map(Number);
    return { lat, lng };
  }

  /**
   * Parsea una cadena de ruta a un array de objetos { lat: number; lng: number }
   * @param pathStr - La cadena de ruta en formato "{""(-76.849285,-12.276377)""}" donde:
   *                 - El primer número es la longitud en grados decimales (ej: -76.849285° = 76°50'57.4"W)
   *                 - El segundo número es la latitud en grados decimales (ej: -12.276377° = 12°16'35.0"S)
   * @returns El array de objetos { lat: number; lng: number }
   */
  private parsePath(pathStr: string): { lat: number; lng: number }[] {
    try {
      // Eliminar las comillas dobles externas y los corchetes
      const cleanStr = pathStr.replace(/^"{|}"$/g, '');

      // Dividir por comillas dobles y filtrar elementos vacíos y comas
      const points = cleanStr
        .split('"')
        .filter((point) => point.trim() !== '' && point.trim() !== ',')
        .map((point) => point.replace(/[()]/g, ''));

      // Convertir cada punto a coordenadas
      return points
        .map((point) => {
          const [lng, lat] = point.split(',').map(Number);
          return {
            lat: Number(lat), // Latitud en grados decimales (ej: -12.276377° = 12°16'35.0"S)
            lng: Number(lng), // Longitud en grados decimales (ej: -76.849285° = 76°50'57.4"W)
          };
        })
        .filter(
          (point) =>
            !isNaN(point.lat) &&
            !isNaN(point.lng) &&
            (point.lat !== 0 || point.lng !== 0),
        );
    } catch (error) {
      this.logger.error('Error parsing path:', error);
      return [];
    }
  }

  /**
   * Crea una incidencia
   * @param incidenciaDto - La incidencia a crear
   * @returns La incidencia creada
   */
  async createIncidencia(
    id_usuario: UUID,
    incidenciaDto: CreateIncidenciaDto,
  ): Promise<void> {
    const query = `
      INSERT INTO Incidencia (
        id_monitoreo_ruta,
        tipo_incidencia,
        severidad,
        descripcion,
        id_usuario
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;

    await this.databaseService.query(query, [
      incidenciaDto.id_monitoreo_ruta,
      incidenciaDto.tipo_incidencia,
      incidenciaDto.severidad,
      incidenciaDto.descripcion,
      id_usuario,
    ]);
  }

  /**
   * Actualiza el estado de una incidencia
   * @param incidenciaId - El ID de la incidencia
   * @param incidenciaDto - La incidencia a actualizar
   */
  async updateIncidenciaState(
    incidenciaId: UUID,
    estado_incidencia: EstadoIncidencia,
  ): Promise<void> {
    const query = `
    UPDATE Incidencia
    SET
        estado_incidencia = $1
    WHERE
        id_incidencia = $2;
    `;
    await this.databaseService.query(query, [estado_incidencia, incidenciaId]);
  }

  /**
   * Soluciona una incidencia
   * @param incidenciaId - El ID de la incidencia
   * @param solucion_incidencia - La solución de la incidencia
   * @param authenticatedUserId - El ID del usuario autenticado
   */
  async solucionarIncidencia(
    incidenciaId: UUID,
    solucion_incidencia: SolucionIncidenciaDto,
    authenticatedUserId: UUID,
  ): Promise<void> {
    // Usar el ID del usuario autenticado si no se proporciona en el DTO
    const userId = solucion_incidencia.id_usuario || authenticatedUserId;

    const query = `
      INSERT INTO Solucion_incidencia (
          id_incidencia,
          id_usuario,
          descripcion_solucion,
          costo_solucion,
          tiempo_resolucion,
          observaciones
      ) VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6
      );
    `;
    const result = await this.databaseService.query(query, [
      incidenciaId,
      userId,
      solucion_incidencia.descripcion_solucion,
      solucion_incidencia.costo_solucion,
      solucion_incidencia.tiempo_resolucion,
      solucion_incidencia.observaciones,
    ]);

    if (result.rowCount && result.rowCount > 0) {
      await this.updateIncidenciaState(incidenciaId, EstadoIncidencia.RESUELTA);
    }
  }

  /**
   * Obtiene los despachos paginados
   * @param page - La página
   * @param limit - El límite
   * @returns Los despachos paginados
   */
  async getDespachosPaginados(
    page: number,
    limit: number,
  ): Promise<{
    items: DespachoDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const offset = (page - 1) * limit;

    // Contar despachos únicos
    const countResult = await this.databaseService.query(
      `SELECT COUNT(DISTINCT id_despacho) as count FROM vista_despachos_estado`,
      [],
    );
    const total = parseInt((countResult.rows[0] as { count: string }).count);

    // Obtener todos los datos de la vista ordenados por despacho y orden de parada
    const result = await this.databaseService.query(
      `SELECT * FROM vista_despachos_estado 
       ORDER BY id_despacho, orden_parada 
       LIMIT $1 OFFSET $2`,
      [limit * 10, offset * 10], // Multiplicamos por 10 para asegurar que obtenemos suficientes filas para agrupar
    );

    // Agrupar los datos por despacho
    const despachosMap = new Map<string, Partial<DespachoDto>>();

    result.rows.forEach((row: VistaDespachosRow) => {
      const despachoId = row.id_despacho;

      if (!despachosMap.has(despachoId)) {
        // Crear el despacho base con datos únicos
        despachosMap.set(despachoId, {
          id_despacho: row.id_despacho,
          fecha_despacho: row.fecha_despacho,
          estado_recorrido: row.estado_recorrido,
          tiempo_total_estimado: row.tiempo_total_estimado,
          total_paradas: row.total_paradas,
          placa_vehiculo: row.placa_vehiculo,
          tipo_vehiculo: row.tipo_vehiculo,
          modelo: row.modelo,
          nombre_conductor: row.nombre_conductor,
          telefono_conductor: row.telefono_conductor,
          tipo_conservacion: row.tipo_conservacion,
          ubicacion_origen: row.ubicacion_origen,
          peso_total: row.peso_total,
          stops: [],
        });
      }

      // Agregar la parada al array de stops
      const despacho = despachosMap.get(despachoId);
      if (despacho) {
        despacho.stops!.push({
          nombre_destino: row.nombre_destino,
          nombre_ruta: row.nombre_ruta,
          orden_parada: row.orden_parada,
        });
      }
    });

    // Convertir el Map a array y aplicar la paginación correcta
    const despachosArray = Array.from(despachosMap.values());
    const paginatedDespachos = despachosArray.slice(0, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      items: paginatedDespachos as DespachoDto[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Obtiene las incidencias paginadas
   * @param page - La página
   * @param limit - El límite
   * @returns Las incidencias paginadas
   */
  async getIncidenciasPaginadas(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: IncidenciaDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const offset = (page - 1) * limit;

    const countResult = await this.databaseService.query(
      `SELECT COUNT(*) as count FROM vista_incidencias`,
      [],
    );
    const total = parseInt((countResult.rows[0] as { count: string }).count);

    const result = await this.databaseService.query(
      `SELECT * FROM vista_incidencias 
       ORDER BY fecha_registro DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const totalPages = Math.ceil(total / limit);

    return {
      items: result.rows as IncidenciaDto[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Obtiene los datos básicos de un despacho
   * @param despachoId - ID del despacho
   * @returns Datos básicos del despacho
   */
  async getDespachoDatos(despachoId: UUID): Promise<DespachoDatosDto> {
    const result = await this.databaseService.query(
      `SELECT * FROM fn_datos_despacho($1)`,
      [despachoId],
    );

    if (result.rows.length === 0) {
      throw new CustomException('Despacho no encontrado', 404);
    }

    // Tomamos el primer registro para los datos comunes
    const despacho = result.rows[0] as DespachoDatos;

    // Mapeamos todas las cargas
    const cargas = result.rows.map((row: DespachoDatos) => ({
      id_carga: row.id_carga,
      tipo_conservacion: row.tipo_conservacion,
      rango_inicial_temperatura_requerida:
        row.rango_inicial_temperatura_requerida,
      rango_final_temperatura_requerida: row.rango_final_temperatura_requerida,
      peso_total: row.peso_total,
    }));

    return {
      fecha_despacho: despacho.fecha_despacho,
      estado_recorrido: despacho.estado_recorrido,
      vehiculo: {
        id_vehiculo: despacho.id_vehiculo,
        modelo: despacho.modelo,
        marca: despacho.marca,
        placa: despacho.placa,
        color: despacho.color,
        año: despacho.año,
        estado_vehiculo: despacho.estado_vehiculo,
        foto_vehiculo: despacho.foto_vehiculo,
        capacidad_carga: despacho.capacidad_carga,
        capacidad_combustible: despacho.capacidad_combustible,
        gps_imei: despacho.gps_imei,
        gps_estado: despacho.gps_estado,
        fecha_vencimiento_soat: despacho.fecha_vencimiento_soat,
        numero_soat: despacho.numero_soat,
      },
      conductor: {
        id_conductor: despacho.id_conductor,
        dni: despacho.dni,
        nombre_conductor: despacho.nombre_conductor,
        telefono_conductor: despacho.telefono_conductor,
        foto_conductor: despacho.foto_conductor,
        email_conductor: despacho.email_conductor,
        fecha_nacimiento: despacho.fecha_nacimiento,
        direccion_conductor: despacho.direccion_conductor,
        tipo_licencia: despacho.tipo_licencia,
        fecha_vencimiento_licencia: despacho.fecha_vencimiento_licencia,
        fecha_emision_licencia: despacho.fecha_emision_licencia,
        estado_conductor: despacho.estado_conductor,
      },
      cargas: cargas,
    };
  }

  /**
   * Obtiene los puntos de la ruta de un despacho
   * @param despachoId - ID del despacho
   * @returns Puntos de la ruta
   */
  async getPuntosRuta(despachoId: UUID): Promise<PuntoRutaDto[]> {
    const result = await this.databaseService.query(
      'SELECT * FROM fn_puntos_ruta_despacho($1)',
      [despachoId],
    );

    const puntosRuta = result.rows as PuntoRutaDatos[];

    return puntosRuta.map((puntoRuta) => ({
      orden_parada: puntoRuta.orden_parada,
      nombre_origen: puntoRuta.nombre_origen,
      coordenada_origen: this.parsePoint(puntoRuta.coordenada_origen),
      nombre_destino: puntoRuta.nombre_destino,
      coordenada_destino: this.parsePoint(puntoRuta.coordenada_destino),
      nombre_ruta: puntoRuta.nombre_ruta,
      recorrido_km: puntoRuta.recorrido_km,
      distancia_km: puntoRuta.distancia_km,
      tiempo_estimado: puntoRuta.tiempo_estimado,
      ruta_planificada: this.parsePath(puntoRuta.ruta_planificada),
    }));
  }

  /**
   * Obtiene los puntos visitados de un despacho
   * @param despachoId - ID del despacho
   * @returns Puntos visitados
   */
  async getPuntosVisitados(despachoId: UUID): Promise<PuntoVisitadoDto[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM fn_puntos_visitados_despacho($1)`,
      [despachoId],
    );

    const puntosVisitados = result.rows as PuntoVisitadoDatos[];

    return puntosVisitados.map((puntoVisitado) => ({
      orden_parada: puntoVisitado.orden_parada,
      nombre_punto: puntoVisitado.nombre_punto,
      coordenada_punto: this.parsePoint(puntoVisitado.coordenada_punto),
      visitado: puntoVisitado.visitado,
    }));
  }

  /**
   * Obtiene los datos de una incidencia
   * @param incidenciaId - ID de la incidencia
   * @returns Datos de la incidencia
   */
  async getIncidenciaDatos(incidenciaId: UUID): Promise<IncidenciaDatosDto> {
    const result = await this.databaseService.query(
      `SELECT * FROM fn_detalle_incidencia($1)`,
      [incidenciaId],
    );

    if (result.rows.length === 0) {
      throw new CustomException('Incidencia no encontrada', 404);
    }

    const incidencia = result.rows[0] as IncidenciaDatos;

    return {
      fecha_registro: incidencia.fecha_registro,
      tipo_incidencia: incidencia.tipo_incidencia,
      severidad: incidencia.severidad,
      descripcion: incidencia.descripcion,
      estado_incidencia: incidencia.estado_incidencia,
      nombre_usuario: incidencia.nombre_usuario,
      ubicacion_actual: this.parsePoint(incidencia.ubicacion_actual),
      velocidad: incidencia.velocidad,
      temperatura_carga: incidencia.temperatura_carga,
      combustible_restante: incidencia.combustible_restante,
      estado_compartimento: incidencia.estado_compartimento,
      distancia_recorrida: incidencia.distancia_recorrida,
      tiempo_transcurrido: incidencia.tiempo_transcurrido,
      placa: incidencia.placa,
      modelo: incidencia.modelo,
      nombre_conductor: incidencia.nombre_conductor,
      telefono_conductor: incidencia.telefono_conductor,
    };
  }

  async getIncidenciasRelacionadas(
    incidenciaId: UUID,
  ): Promise<IncidenciaRelacionadaDto[]> {
    const result = await this.databaseService.query(
      `SELECT * FROM fn_incidencias_relacionadas($1)`,
      [incidenciaId],
    );

    return result.rows as IncidenciaRelacionadaDto[];
  }
}
