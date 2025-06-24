import { Test, TestingModule } from '@nestjs/testing';
import { MonitoreoEnRutaService } from './monitoreo-en-ruta.service';

describe('MonitoreoEnRutaService', () => {
  let service: MonitoreoEnRutaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoreoEnRutaService],
    }).compile();

    service = module.get<MonitoreoEnRutaService>(MonitoreoEnRutaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
