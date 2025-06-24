import { Module } from '@nestjs/common';
import { RegistrarEntregaController } from './registrar-entrega.controller';
import { RegistrarEntregaService } from './registrar-entrega.service';
import { DatabaseService } from '../../database/database.service';

@Module({
  controllers: [RegistrarEntregaController],
  providers: [RegistrarEntregaService, DatabaseService],
})
export class RegistrarEntregaModule {}
