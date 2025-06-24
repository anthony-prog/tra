import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionTransporteService } from './asignacion-transporte.service';

describe('AsignacionTransporteService', () => {
  let service: AsignacionTransporteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionTransporteService],
    }).compile();

    service = module.get<AsignacionTransporteService>(
      AsignacionTransporteService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
