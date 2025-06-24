import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionTransporteController } from './asignacion-transporte.controller';

describe('AsignacionTransporteController', () => {
  let controller: AsignacionTransporteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionTransporteController],
    }).compile();

    controller = module.get<AsignacionTransporteController>(
      AsignacionTransporteController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
