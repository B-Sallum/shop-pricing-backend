import { Injectable } from '@nestjs/common';
import { CreatePriceUpdaterDto } from './dto/create-price-updater.dto';
import { UpdatePriceUpdaterDto } from './dto/update-price-updater.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Products } from './entities/price-updater.entity';

@Injectable()
export class PriceUpdaterService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createPriceUpdaterDto: CreatePriceUpdaterDto) {
  //   return 'This action adds a new priceUpdater';
  // }

  async findAllProducts(): Promise<any> {
    return JSON.stringify(
      await this.prisma.products.findMany(),
      (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
    );
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} priceUpdater`;
  // }

  // update(id: number, updatePriceUpdaterDto: UpdatePriceUpdaterDto) {
  //   return `This action updates a #${id} priceUpdater`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} priceUpdater`;
  // }
}
