import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonitoreoEnRutaModule } from './monitoreo-en-ruta/monitoreo-en-ruta.module';
import { DatabaseModule } from './database/database.module';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { AsignacionTransporteController } from './asignacion_transporte/asignacion-transporte.controller';
import { AsignacionTransporteService } from './asignacion_transporte/asignacion-transporte.service';
import { AsignacionTransporteModule } from './asignacion_transporte/asignacion-transporte.module';
import { ControlEntregaModule } from './control-entrega/control-entrega.module';
import { GestionDespachoModule } from './gestion-despacho/gestion-despacho.module';
import { PlanificacionEntregaService } from './planificacion-entrega/planificacion-entrega.service';
import { PlanificacionEntregaController } from './planificacion-entrega/planificacion-entrega.controller';
import { PlanificacionEntregaModule } from './planificacion-entrega/planificacion-entrega.module';
import { RecepcionOrdenModule } from './recepcion-orden/recepcion-orden.module';
import { ReclamoDevolucionService } from './reclamo-devolucion/reclamo-devolucion.service';
import { ReclamoDevolucionController } from './reclamo-devolucion/reclamo-devolucion.controller';
import { ReclamoDevolucionModule } from './reclamo-devolucion/reclamo-devolucion.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MonitoreoEnRutaModule,
    DatabaseModule,
    AuthModule,
    AsignacionTransporteModule,
    ControlEntregaModule,
    GestionDespachoModule,
    PlanificacionEntregaModule,
    RecepcionOrdenModule,
    ReclamoDevolucionModule,
  ],
  controllers: [
    AsignacionTransporteController,
    PlanificacionEntregaController,
    ReclamoDevolucionController,
  ],
  providers: [
    AsignacionTransporteService,
    PlanificacionEntregaService,
    ReclamoDevolucionService,
  ],
})
export class AppModule {}
