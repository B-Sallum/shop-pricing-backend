import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pack, Product } from './entities/price-updater.entity';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PriceUpdaterService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProducts(): Promise<Product | Product[]> {
    return await this.prisma.products.findMany();
  }

  async findOneProduct(code: number): Promise<Product | [Product, Pack[]]> {
    const product = await this.prisma.products.findUnique({
      where: {
        code,
      },
    });

    const pack = await this.prisma.packs.findMany({
      where: {
        product_id: code,
      },
    });
    console.log(
      '🚀 ~ file: price-updater.service.ts:30 ~ PriceUpdaterService ~ findOneProduct ~ pack:',
      pack.length,
    );

    return pack.length === 0 ? product : [product, pack];
  }

  async updateProduct(code: number, new_sales_price: Decimal): Promise<string> {
    const product = await this.findOneProduct(code);

    if (!product) throw new NotFoundException('Product not found');

    // FINANCIAL RULES
    if (+product[0].cost_price > +new_sales_price)
      throw new NotAcceptableException(
        'The new sales price should be higher than the cost price',
      );

    // MARKETING RULES
    if (
      +product[0].sales_price * 1.1 < +new_sales_price ||
      +product[0].sales_price * 0.9 > +new_sales_price
    )
      throw new NotAcceptableException(
        'The price cannot flutuate more than 10%',
      );

    // IF IT IS A PRODUCT IN PACK RULES

    // IF IT IS A PACK TO PRODUCT UPDATE

    //UPDATE PRODUCT
    await this.prisma.products.update({
      where: {
        code,
      },
      data: {
        sales_price: new_sales_price,
      },
    });

    return 'Product updated';
  }
}
