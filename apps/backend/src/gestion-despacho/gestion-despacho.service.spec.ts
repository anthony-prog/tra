import { Test, TestingModule } from '@nestjs/testing';
import { GestionDespachoService } from './gestion-despacho.service';

describe('GestionDespachoService', () => {
  let service: GestionDespachoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GestionDespachoService],
    }).compile();

    service = module.get<GestionDespachoService>(GestionDespachoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
