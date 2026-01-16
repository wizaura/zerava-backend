import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSlotsService } from './service-slots.service';

describe('ServiceSlotsService', () => {
  let service: ServiceSlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceSlotsService],
    }).compile();

    service = module.get<ServiceSlotsService>(ServiceSlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
