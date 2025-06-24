import { Test, TestingModule } from '@nestjs/testing';
import { RecepcionOrdenController } from './recepcion-orden.controller';

describe('RecepcionOrdenController', () => {
  let controller: RecepcionOrdenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecepcionOrdenController],
    }).compile();

    controller = module.get<RecepcionOrdenController>(RecepcionOrdenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
