import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { JwtModule } from '@nestjs/jwt';
import { MonitoreoEnRutaService } from './monitoreo-en-ruta.service';
import { MonitoreoEnRutaController } from './monitoreo-en-ruta.controller';
import { DatabaseModule } from '../database/database.module';
import { GestionDespachoModule } from '../gestion-despacho/gestion-despacho.module';
import { MqttModule } from './mqtt/mqtt.module';
import { MonitoreoRutaProcessor } from './processors/monitoreo-ruta.processor';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    GestionDespachoModule,
    MqttModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'tu_clave_secreta_super_segura',
      signOptions: { expiresIn: '24h' },
    }),
    BullModule.registerQueue(
      {
        name: 'monitoreo',
      },
      {
        name: 'events',
      },
    ),
  ],
  controllers: [MonitoreoEnRutaController],
  providers: [MonitoreoEnRutaService, MonitoreoRutaProcessor],
  exports: [MonitoreoEnRutaService],
})
export class MonitoreoEnRutaModule {}
