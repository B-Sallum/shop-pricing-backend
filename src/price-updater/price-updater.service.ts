import { Injectable } from '@nestjs/common';
import { UpdatePriceUpdaterDto } from './dto/update-price-updater.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Products } from './entities/price-updater.entity';

const serializeBigInt = (product: Products | Products[]) => {
  return JSON.stringify(product, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};

@Injectable()
export class PriceUpdaterService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts() {
    return serializeBigInt(await this.prisma.products.findMany());
  }

  async findOne(code: number) {
    return serializeBigInt(
      await this.prisma.products.findUnique({
        where: {
          code,
        },
      }),
    );
  }

  update(code: number, updatePriceUpdaterDto: UpdatePriceUpdaterDto) {
    return `This action updates a #${code} priceUpdater`;
  }
}
