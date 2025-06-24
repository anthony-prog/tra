import { Test, TestingModule } from '@nestjs/testing';
import { ControlEntregaService } from './control-entrega.service';

describe('ControlEntregaService', () => {
  let service: ControlEntregaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlEntregaService],
    }).compile();

    service = module.get<ControlEntregaService>(ControlEntregaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
