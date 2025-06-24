import { Test, TestingModule } from '@nestjs/testing';
import { PlanificacionEntregaController } from './planificacion-entrega.controller';

describe('PlanificacionEntregaController', () => {
  let controller: PlanificacionEntregaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanificacionEntregaController],
    }).compile();

    controller = module.get<PlanificacionEntregaController>(
      PlanificacionEntregaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
