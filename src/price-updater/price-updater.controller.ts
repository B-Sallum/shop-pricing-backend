import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PriceUpdaterService } from './price-updater.service';
import { CreatePriceUpdaterDto } from './dto/create-price-updater.dto';
import { UpdatePriceUpdaterDto } from './dto/update-price-updater.dto';

@Controller('price-updater')
export class PriceUpdaterController {
  constructor(private readonly priceUpdaterService: PriceUpdaterService) {}

  // @Post()
  // create(@Body() createPriceUpdaterDto: CreatePriceUpdaterDto) {
  //   return this.priceUpdaterService.create(createPriceUpdaterDto);
  // }

  @Get('products')
  findAllProducts() {
    return this.priceUpdaterService.findAllProducts();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.priceUpdaterService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePriceUpdaterDto: UpdatePriceUpdaterDto) {
  //   return this.priceUpdaterService.update(+id, updatePriceUpdaterDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.priceUpdaterService.remove(+id);
  // }
}
