import { Controller, Get, Patch, Param } from '@nestjs/common';
import { PriceUpdaterService } from './price-updater.service';
import { Decimal } from '@prisma/client/runtime/library';
import { Pack, Product } from './entities/price-updater.entity';

const serializeBigInt = (product: Product | Product[] | [Product, Pack[]]) => {
  return JSON.stringify(product, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};

@Controller('price-updater/products')
export class PriceUpdaterController {
  constructor(private readonly priceUpdaterService: PriceUpdaterService) {}

  @Get()
  async findAllProducts(): Promise<string> {
    return serializeBigInt(await this.priceUpdaterService.findAllProducts());
  }

  @Get(':code')
  async findOneProduct(@Param('code') code: string): Promise<string> {
    return serializeBigInt(
      await this.priceUpdaterService.findOneProduct(+code),
    );
  }

  @Patch(':code/:newPrice')
  async updateProduct(
    @Param('code') code: string,
    @Param('newPrice') new_sales_price: string,
  ) {
    return await this.priceUpdaterService.updateProduct(
      +code,
      new Decimal(new_sales_price),
    );
  }
}
