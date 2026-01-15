import { Test, TestingModule } from '@nestjs/testing';
import { ServicePricingService } from './service-pricing.service';

describe('ServicePricingService', () => {
  let service: ServicePricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePricingService],
    }).compile();

    service = module.get<ServicePricingService>(ServicePricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
