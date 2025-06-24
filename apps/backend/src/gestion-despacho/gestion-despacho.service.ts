import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateDespachoDto } from 'src/gestion-despacho/dto/create-despacho.dto';
import { CreateRechazoDespachoDto } from 'src/gestion-despacho/dto/create-rechazodespacho.dto';
import { Despacho } from 'src/gestion-despacho/interfaces/despacho.interface';

@Injectable()
export class GestionDespachoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<Despacho[]> {
    const query = 'SELECT * FROM despacho';
    const result = await this.databaseService.query(query);
    return result.rows as Despacho[];
  }

  // insertar un despacho
  async insertarDespacho(despacho: CreateDespachoDto): Promise<void> {
    const query = `
          INSERT INTO despacho (id_resultado_condicion_despacho, id_usuario, estado_recorrido, observaciones)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
    await this.databaseService.query(query, [
      despacho.id_resultado_condicion_despacho,
      despacho.id_usuario,
      despacho.estado_recorrido,
      despacho.observaciones,
    ]);
  }

  // insertar rechazo despacho
  async insertarRechazoDespacho(
    rechazo: CreateRechazoDespachoDto,
  ): Promise<void> {
    const query = `
      INSERT INTO rechazo_despacho (
        id_resultado_condicion_despacho,
        id_usuario,
        motivo_rechazo,
        tipo_accion,
        estado_accion
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    await this.databaseService.query(query, [
      rechazo.id_resultado_condicion_despacho,
      rechazo.id_usuario,
      rechazo.motivo_rechazo,
      rechazo.tipo_accion,
      rechazo.estado_accion,
    ]);
  }
}
