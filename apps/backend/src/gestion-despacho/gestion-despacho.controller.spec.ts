import { Test, TestingModule } from '@nestjs/testing';
import { GestionDespachoController } from './gestion-despacho.controller';

describe('GestionDespachoController', () => {
  let controller: GestionDespachoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GestionDespachoController],
    }).compile();

    controller = module.get<GestionDespachoController>(
      GestionDespachoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
