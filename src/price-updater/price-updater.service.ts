import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from './entities/price-updater.entity';
import { Decimal } from '@prisma/client/runtime/library';

const serializeBigInt = (product: Product | Product[]) => {
  return JSON.stringify(product, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};

@Injectable()
export class PriceUpdaterService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts(): Promise<string> {
    return serializeBigInt(await this.prisma.products.findMany());
  }

  async findOne(code: number): Promise<string> {
    return serializeBigInt(
      await this.prisma.products.findUnique({
        where: {
          code,
        },
      }),
    );
  }

  async update(code: number, sales_price: Decimal) {
    const product = await this.prisma.products.findUnique({
      where: {
        code,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (+product.cost_price > +sales_price)
      throw new NotAcceptableException(
        'The new price should be higher than the cost price',
      );

    if (
      +product.sales_price * 1.1 < +sales_price ||
      +product.sales_price * 0.9 > +sales_price
    )
      throw new NotAcceptableException('The price');

    return serializeBigInt(
      await this.prisma.products.update({
        where: {
          code,
        },
        data: {
          sales_price: value,
        },
      }),
    );
  }
}
