import { Module } from '@nestjs/common';
import { OrdenesPendientesController } from './ordenes-pendientes.controller';
import { OrdenesPendientesService } from './ordenes-pendientes.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdenesPendientesController],
  providers: [OrdenesPendientesService],
  exports: [OrdenesPendientesService],
})
export class OrdenesPendientesModule {}
