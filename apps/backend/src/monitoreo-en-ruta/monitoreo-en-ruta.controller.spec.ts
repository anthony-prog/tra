import { Test, TestingModule } from '@nestjs/testing';
import { MonitoreoEnRutaController } from './monitoreo-en-ruta.controller';

describe('MonitoreoEnRutaController', () => {
  let controller: MonitoreoEnRutaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoreoEnRutaController],
    }).compile();

    controller = module.get<MonitoreoEnRutaController>(
      MonitoreoEnRutaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
