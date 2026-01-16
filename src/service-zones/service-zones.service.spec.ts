import { Test, TestingModule } from '@nestjs/testing';
import { ServiceZonesService } from './service-zones.service';

describe('ServiceZonesService', () => {
  let service: ServiceZonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceZonesService],
    }).compile();

    service = module.get<ServiceZonesService>(ServiceZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
