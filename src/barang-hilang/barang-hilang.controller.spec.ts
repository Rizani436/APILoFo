import { Test, TestingModule } from '@nestjs/testing';
import { BarangHilangController } from './barang-hilang.controller';

describe('BarangHilangController', () => {
  let controller: BarangHilangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarangHilangController],
    }).compile();

    controller = module.get<BarangHilangController>(BarangHilangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
