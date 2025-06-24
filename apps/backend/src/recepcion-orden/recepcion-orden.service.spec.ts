import { Test, TestingModule } from '@nestjs/testing';
import { RecepcionOrdenService } from './recepcion-orden.service';

describe('RecepcionOrdenService', () => {
  let service: RecepcionOrdenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecepcionOrdenService],
    }).compile();

    service = module.get<RecepcionOrdenService>(RecepcionOrdenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
