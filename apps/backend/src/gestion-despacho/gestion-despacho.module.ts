import { forwardRef, Module } from '@nestjs/common';
import { GestionDespachoController } from './gestion-despacho.controller';
import { GestionDespachoService } from './gestion-despacho.service';
import { DatabaseModule } from 'src/database/database.module';
import { MonitoreoEnRutaModule } from 'src/monitoreo-en-ruta/monitoreo-en-ruta.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => MonitoreoEnRutaModule)],
  controllers: [GestionDespachoController],
  providers: [GestionDespachoService],
  exports: [GestionDespachoService],
})
export class GestionDespachoModule {}
