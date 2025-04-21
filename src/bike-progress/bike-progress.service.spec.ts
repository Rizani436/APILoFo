import { Test, TestingModule } from '@nestjs/testing';
import { BikeProgressService } from './bike-progress.service';

describe('BikeProgressService', () => {
  let service: BikeProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BikeProgressService],
    }).compile();

    service = module.get<BikeProgressService>(BikeProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
