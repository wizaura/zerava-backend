import { Test, TestingModule } from '@nestjs/testing';
import { ServiceZonesController } from './service-zones.controller';

describe('ServiceZonesController', () => {
  let controller: ServiceZonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceZonesController],
    }).compile();

    controller = module.get<ServiceZonesController>(ServiceZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
