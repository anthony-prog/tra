import { Module } from '@nestjs/common';
import { ControlEntregaService } from './control-entrega.service';
import { ControlEntregaController } from './control-entrega.controller';
import { OrdenesPendientesModule } from './ordenes-pendientes/ordenes-pendientes.module';
import { RegistrarEntregaModule } from './registrar-entrega/registrar-entrega.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    OrdenesPendientesModule,
    RegistrarEntregaModule,
    AuthModule, // ← Sin corchetes adicionales
  ], // 👈 agregar aquí
  providers: [ControlEntregaService],
  controllers: [ControlEntregaController],
})
export class ControlEntregaModule {}
