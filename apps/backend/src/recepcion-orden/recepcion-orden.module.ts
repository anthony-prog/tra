import { Module } from '@nestjs/common';
import { RecepcionOrdenController } from './recepcion-orden.controller';
import { RecepcionOrdenService } from './recepcion-orden.service';

@Module({
  controllers: [RecepcionOrdenController],
  providers: [RecepcionOrdenService],
})
export class RecepcionOrdenModule {}
