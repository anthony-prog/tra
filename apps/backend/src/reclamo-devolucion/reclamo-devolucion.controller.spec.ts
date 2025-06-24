import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoDevolucionController } from './reclamo-devolucion.controller';

describe('ReclamoDevolucionController', () => {
  let controller: ReclamoDevolucionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReclamoDevolucionController],
    }).compile();

    controller = module.get<ReclamoDevolucionController>(
      ReclamoDevolucionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
