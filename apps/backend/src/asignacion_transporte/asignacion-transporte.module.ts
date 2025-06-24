import { Module } from '@nestjs/common';
import { AsignacionTransporteController } from './asignacion-transporte.controller';
import { AsignacionTransporteService } from './asignacion-transporte.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AsignacionTransporteController],
  providers: [AsignacionTransporteService],
  exports: [AsignacionTransporteService],
})
export class AsignacionTransporteModule {}
