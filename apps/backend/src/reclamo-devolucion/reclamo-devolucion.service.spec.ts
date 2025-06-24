import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoDevolucionService } from './reclamo-devolucion.service';

describe('ReclamoDevolucionService', () => {
  let service: ReclamoDevolucionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReclamoDevolucionService],
    }).compile();

    service = module.get<ReclamoDevolucionService>(ReclamoDevolucionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
