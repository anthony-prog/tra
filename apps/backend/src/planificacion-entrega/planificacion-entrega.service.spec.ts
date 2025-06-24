import { Test, TestingModule } from '@nestjs/testing';
import { PlanificacionEntregaService } from './planificacion-entrega.service';

describe('PlanificacionEntregaService', () => {
  let service: PlanificacionEntregaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanificacionEntregaService],
    }).compile();

    service = module.get<PlanificacionEntregaService>(
      PlanificacionEntregaService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
