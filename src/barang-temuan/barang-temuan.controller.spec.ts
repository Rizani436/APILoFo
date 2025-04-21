import { Test, TestingModule } from '@nestjs/testing';
import { BarangTemuanController } from './barang-temuan.controller';

describe('BarangTemuanController', () => {
  let controller: BarangTemuanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangTemuanController],
    }).compile();

    controller = module.get<BarangTemuanController>(BarangTemuanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
