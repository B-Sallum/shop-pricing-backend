import { Controller, Get, Patch, Param } from '@nestjs/common';
import { PriceUpdaterService } from './price-updater.service';
import { Decimal } from "@prisma/client/runtime/library";

@Controller('price-updater/products')
export class PriceUpdaterController {
  constructor(private readonly priceUpdaterService: PriceUpdaterService) {}

  @Get()
  findAllProducts(): Promise<string> {
    return this.priceUpdaterService.findAllProducts();
  }

  @Get(':code')
  findOne(@Param('code') code: string): Promise<string> {
    return this.priceUpdaterService.findOne(+code);
  }

  @Patch(':code/:newPrice')
  update(
    @Param('code') code: string,
    @Param('newPrice') sales_price: string
  ) {
    return this.priceUpdaterService.update(+code, new Decimal(sales_price));
  }
}
