import { Test, TestingModule } from '@nestjs/testing';
import { ServiceSlotsController } from './service-slots.controller';

describe('ServiceSlotsController', () => {
  let controller: ServiceSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceSlotsController],
    }).compile();

    controller = module.get<ServiceSlotsController>(ServiceSlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
