import { Test, TestingModule } from '@nestjs/testing';
import { BarangHilangService } from './barang-hilang.service';

describe('BarangHilangService', () => {
  let service: BarangHilangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarangHilangService],
    }).compile();

    service = module.get<BarangHilangService>(BarangHilangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
