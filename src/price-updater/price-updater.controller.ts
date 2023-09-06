import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { PriceUpdaterService } from './price-updater.service';
import { UpdatePriceUpdaterDto } from './dto/update-price-updater.dto';

@Controller('price-updater/products')
export class PriceUpdaterController {
  constructor(private readonly priceUpdaterService: PriceUpdaterService) {}

  @Get()
  findAllProducts(): Promise<string> {
    return this.priceUpdaterService.findAllProducts();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.priceUpdaterService.findOne(+code);
  }

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updatePriceUpdaterDto: UpdatePriceUpdaterDto,
  ) {
    return this.priceUpdaterService.update(+code, updatePriceUpdaterDto);
  }
}
