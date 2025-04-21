import { Test, TestingModule } from '@nestjs/testing';
import { JawabanPertanyaanService } from './jawaban-pertanyaan.service';

describe('JawabanPertanyaanService', () => {
  let service: JawabanPertanyaanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JawabanPertanyaanService],
    }).compile();

    service = module.get<JawabanPertanyaanService>(JawabanPertanyaanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
