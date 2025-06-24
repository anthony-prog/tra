import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { RegistrarEntregaDto } from './dto/registrar-entrega.dto';

@Injectable()
export class RegistrarEntregaService {
  constructor(private readonly db: DatabaseService) {}

  async actualizarEntrega(dto: RegistrarEntregaDto) {
    const query = `
      UPDATE Entrega
      SET
        estado_entrega = $1,
        firma_cliente = $2,
        evidencia = $3,
        observaciones = $4,
        fecha_entrega = NOW(),
        fecha_actualizacion = NOW()
      WHERE id_entrega = $5
    `;

    const values = [
      dto.estadoEntrega, // <- debes asignar un estado válido del enum aquí
      dto.firmaCliente,
      dto.evidencia,
      dto.observaciones,
      dto.idEntrega,
    ];


    await this.db.query(query, values);

    return {
      mensaje: 'Entrega actualizada exitosamente',
      idEntrega: dto.idEntrega,
    };
  }
}
