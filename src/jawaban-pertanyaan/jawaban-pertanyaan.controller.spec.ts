import { Test, TestingModule } from '@nestjs/testing';
import { JawabanPertanyaanController } from './jawaban-pertanyaan.controller';

describe('JawabanPertanyaanController', () => {
  let controller: JawabanPertanyaanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JawabanPertanyaanController],
    }).compile();

    controller = module.get<JawabanPertanyaanController>(JawabanPertanyaanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
