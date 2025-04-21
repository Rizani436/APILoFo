import { Test, TestingModule } from '@nestjs/testing';
import { BarangTemuanService } from './barang-temuan.service';

describe('BarangTemuanService', () => {
  let service: BarangTemuanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarangTemuanService],
    }).compile();

    service = module.get<BarangTemuanService>(BarangTemuanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
