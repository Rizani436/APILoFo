import { Test, TestingModule } from '@nestjs/testing';
import { BikeProgressController } from './bike-progress.controller';

describe('BikeProgressController', () => {
  let controller: BikeProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeProgressController],
    }).compile();

    controller = module.get<BikeProgressController>(BikeProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
