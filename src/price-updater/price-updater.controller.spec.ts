import { Test, TestingModule } from '@nestjs/testing';
import { PriceUpdaterController } from './price-updater.controller';
import { PriceUpdaterService } from './price-updater.service';

describe('PriceUpdaterController', () => {
  let controller: PriceUpdaterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceUpdaterController],
      providers: [PriceUpdaterService],
    }).compile();

    controller = module.get<PriceUpdaterController>(PriceUpdaterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
