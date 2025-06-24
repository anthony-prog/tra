import { Test, TestingModule } from '@nestjs/testing';
import { ControlEntregaController } from './control-entrega.controller';

describe('ControlEntregaController', () => {
  let controller: ControlEntregaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlEntregaController],
    }).compile();

    controller = module.get<ControlEntregaController>(ControlEntregaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
